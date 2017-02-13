# Jmonitor Grabber Interface

I_JmonitorGrabber provides the interface for jmonitor.

Before you can run this project, you must install and configure the following dependencies on your machine:
1. [Node.js](https://docs.npmjs.com/getting-started/installing-node)


After installing Node, you should be able to run the following command to install I_JmonitorGrabber.

## Install

```ssh

npm install git+https://github.com/donateoa/I_JmonitorGrabber.git/

```

## Work flow

follow diagram use the observable stream, the samples in the observabele are showen as 

Timer: - t - - - - - - - - - - - - - - - - t - - - - - -

each sample of Timer t will be mapped into a sample of Program observable stream

Timer:      - t - - - - - - - - - - - - - - - - t - - - - - -
Program:    - P - - - - - - - - - - - - - - - - P - - - - - -
each sample of Program will be translated into an array of Url created with the response of Program. the array will be flatten in order to produce the stream URL. The element in stream URL will be pushed with a timimg T.

Timer:      - t - - - - - - - - - - - - - - - - t - - - - - -
Program:    - P - - - - - - - - - - - - - - - - P - - - - - -
URL:        - U U U U U U U - - - - - - - - - - U U U U U U U 

Each element U will be mapped with a request to Grabber Url.
Timer:      - t - - - - - - - - - - - - - - - - t - - - - - -
Program:    - P - - - - - - - - - - - - - - - - P - - - - - -
URL:        - U U U U U U U - - - - - - - - - - U U U U U U U 
Request:    - R R R R R R R - - - - - - - - - - R R R R R R R

each sample of R (remember this is a http.get(U)) must be mapped into a new observable with the data filtered with data that have changed equal true
Timer:      - t - - - - - - - - - - - - - - - - t - - - - - -
Program:    - P - - - - - - - - - - - - - - - - P - - - - - -
URL:        - U U U U U U U - - - - - - - - - - U U U U U U U 
Request:    - R R R R R R R - - - - - - - - - - R R R R R R R
Data:       - D D D D D D D - - - - - - - - - - D D D D D D D
Filter:     - D - - D D D - - - - - - - - - - - D D - D - D D



