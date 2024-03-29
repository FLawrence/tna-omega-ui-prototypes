tna-prototype Infrastructure

## Database

Postgres

#### Pulling data

To populate your local database with the content of staging/production:

```bash
fab pull-staging-data
fab pull-production-data
```

To get images for a build, the following commands will fetch original images only, with no documents, leaving your local build to create image renditions when needed:

```sh
fab pull-staging-images
fab pull-production-images
```

If you do need everything, fetch all media:

```bash
fab pull-staging-media
fab pull-production-media
```

## Cache

What cache backend is used? What is it used for?

What front-end cache is there on production? How is it configured?

## File storage

Does this use AWS S3? Via Buckup? Is it open to the public?

## DNS

## TLS/SSL/HTTPS

## Resetting the Staging site

Steps for resetting the `staging` git branch, and deploying it with a clone of the production site database.

### Pre-flight checks

1. Is this okay with the client, and other developers?
1. Is there any test content on staging that may need to be recreated, or be a reason to delay?
1. What branches are currently merged to staging?

   ```bash
   $ git branch -a --merged origin/staging > branches_on_staging.txt
   $ git branch -a --merged origin/master > branches_on_master.txt
   $ diff branches_on_{master,staging}.txt
   ```

   Take note if any of the above are stale, not needing to be recreated.

1. Are there any user accounts on staging only, which will need to be recreated? Check with the client, and record them.
1. Take a backup of staging
   ```bash
   $ heroku pg:backups:capture -a tnaomegauiprototypes-staging
   ```

### Git

1. Reset the staging branch
   ```bash
   $ git checkout staging && git fetch && git reset --hard origin/master && git push --force
   ```
1. Tell your colleagues
   > @here I have reset the staging branch. Please delete your local staging branches
   >
   > ```
   > $ git branch -D staging
   > ```
   >
   > to avoid accidentally merging in the old version
1. Force-push to Heroku, otherwise CI will later fail `$ git push --force heroku-staging master` (this will trigger a deployment, bear in mind that there may be incompatibilities between the old staging database and the new code from master; this will be resolved in the Database step below)
1. Merge in the relevant branches
   ```bash
   $ git merge --no-ff origin/feature/123-extra-spangles
   ```
1. Check for any newly necessary merge migrations `$ ./manage.py makemigrations --check`

### Database

1. List production database backups:
   ```bash
   $ heroku pg:backups -a tnaomegauiprototypes-production
   ```
1. Get a signed S3 URL of your chosen backup:
   ```bash
   $ heroku pg:backups:url {backup-name} -a tnaomegauiprototypes-production
   ```
1. Upload to staging:
   ```bash
   $ heroku pg:backups:restore {backup-url} DATABASE_URL -a tnaomegauiprototypes-staging
   ```
   This is a destructive action. Proofread it thoroughly.
1. Delete any personally-identifying data from staging. See [Data protection](data_protection.md) for instructions.

### Media

For most sites\* the fab commands are sufficient here. It's quicker just to copy original image files across (with no renditions):

```bash
$ fab pull-production-images
$ fab push-staging-images
```

…otherwise if you need everything, i.e. uploaded documents, images and renditions:

```bash
$ fab pull-production-media
$ fab push-staging-media
```

\* For larger sites, with many gigabytes of media, it may be better to get a sysadmin or the lead developer to copy the S3 buckets directly for speed. Transfers within Amazon's infrastructure are fast (and free, within the same region):

```bash
$ aws s3 sync s3://PRODUCTION_BUCKET_NAME s3://STAGING_BUCKET_NAME
$ aws s3 ls --recursive s3://PRODUCTION_BUCKET_NAME --summarize > bucket-contents-production.txt
$ aws s3 ls --recursive s3://STAGING_BUCKET_NAME --summarize > bucket-contents-staging.txt
$ diff bucket-contents-{production,staging}.txt
```

### Cleanup

1. Check the staging site loads
1. Update the Wagtail Site records, as the database will contain the production URLs
1. Check CI is working https://github.com/torchbox/tna-omega-ui-prototypespipelines

### Comms

1. Inform the client of the changes, e.g.
   > All user accounts have been copied across, so your old staging password will no longer work. Log in with your production password (and then change it), or use the 'forgot password' feature.
   > Any test content has been reset. This is probably the biggest inconvenience. Sorry.
   > I have deleted the personally-identifying data from form submissions **and anywhere else relevant**. If there's any more on production (there shouldn't be) then please let me know and I'll remove it from staging.
