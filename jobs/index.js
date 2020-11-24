"use strict";
const myCOS = require("ibm-cos-sdk");
require("dotenv").config({
  silent: true,
});
const fs = require("fs");

const mobilenet = require("@tensorflow-models/mobilenet");
const tf = require("@tensorflow/tfjs-node");
var config = {
  endpoint:
    process.env.COS_ENDPOINT ||
    "s3.us-south.cloud-object-storage.appdomain.cloud",
  apiKeyId: process.env.COS_JOB_SECRET_APIKEY,
  ibmAuthEndpoint: "https://iam.cloud.ibm.com/identity/token",
  serviceInstanceId: process.env.COS_JOB_SECRET_RESOURCE_INSTANCE_ID,
};

var cosClient = new myCOS.S3(config);
getBucketContents(process.env.COS_BUCKETNAME);
/**
 * Get contents of a COS Bucket
 *
 * @param {*} bucketName
 * @return {*}
 */
function getBucketContents(bucketName) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);
  return cosClient
    .listObjects({ Bucket: bucketName })
    .promise()
    .then((data) => {
      if (data != null && data.Contents != null) {
        for (var i = 0; i < data.Contents.length; i++) {
          var itemKey = data.Contents[i].Key;
          var itemSize = data.Contents[i].Size;
          console.log(`Item: ${itemKey} (${itemSize} bytes).`);
          getItem(bucketName, itemKey);
        }
      }
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
/**
 * Get an Item from a COS Bucket
 *
 * @param {*} bucketName
 * @param {*} itemName
 * @return {*}
 */
function getItem(bucketName, itemName) {
  console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
  return cosClient
    .getObject({
      Bucket: bucketName,
      Key: itemName,
    })
    .promise()
    .then(async (data) => {
      if (data != null) {
        const img = await tf.node.decodeImage(data.Body, 3);
        const model = await mobilenet.load({
          version: 2,
          alpha: 1.0,
        });
        const predictions = await model
          .classify(img, 4)
          .then((response) => {
            console.log(JSON.stringify(response, null, 2));
            createJsonFile(
              bucketName + "/results",
              itemName.split("/")[1] + ".json",
              JSON.stringify(response, null, 2)
            );
          })
          .catch((err) => {
            console.log(err);
          });
        img.dispose();
      }
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
/**
 * Create a JSON file from the Visual Recognition results
 *
 * @param {*} bucketName
 * @param {*} itemName
 * @param {*} fileText
 * @return {*}
 */
function createJsonFile(bucketName, itemName, fileText) {
  console.log(`Creating new item: ${itemName}`);
  return cosClient
    .putObject({
      Bucket: bucketName,
      Key: itemName,
      Body: fileText,
    })
    .promise()
    .then(() => {
      console.log(`Item: ${itemName} created!`);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
