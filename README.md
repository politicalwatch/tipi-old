# TiPi

## Installation

```
git clone git@bitbucket.org:enreda/tipi.git
cd tipi
curl https://install.meteor.com | /bin/sh
```

Copy *settings.json.example* and rename it as *settings.json*

Note: Probably you need to install nodejs, npm and MongoDB.

## Run

```
meteor --settings=settings.json
```

Open a browser and type [localhost:3000](localhost:3000)


## MongoDB credentials

Create a copy of `r-scripts/mongodb-creds.R.example` as `r-scripts/mongodb-creds.R` and change credentials there.