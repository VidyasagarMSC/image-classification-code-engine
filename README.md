# Image Classification with Code Engine and TensorFlow

## Build the container images

Before building and pushing your container images, [plan your image registry](https://cloud.ibm.com/docs/codeengine?topic=codeengine-plan-image)

### Using a private container registry

Follow the [steps here](https://cloud.ibm.com/docs/codeengine?topic=codeengine-add-registry) to add access to a private registry

### Using public Docker Hub

Run the below command to build and push three container images - _frontend, backend and backend-job_ respectively.
   ```
   ./deploy.sh <DOCKER_ACCOUNT_NAME>
   ```
**Note:**
 If you don't wish to build your own container images, you can use the pre-built container images - `vidyasagarmsc/*`. For example,
  ```
  docker pull vidyasagarmsc/frontend
  ```

## Use the container images with the solution tutorial

Follow the steps in the [solution tutorial](https://cloud.ibm.com/docs/solution-tutorials?topic=solution-tutorials-text-analysis-code-engine) and use this code sample to learn about [IBM Cloud™ Code Engine](https://cloud.ibm.com/codeengine/overview) by deploying an image classification application.

**Note:**
- Use the container images built from this code sample. Replace `ibmcom/*` with `<ACCOUNT_NAME>/*`
- Instead of uploading a text file, upload an image (.jpeg, .png) to COS. For sample images, **check the images folder in this repo.**

### Expected output

![](images/output.png)

