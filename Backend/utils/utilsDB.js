import { ScanningActivity } from "../models/scanner.model.js"
async function updateExistingUser(owner, repo, piiVulnerabilities){
    const oldUser = await ScanningActivity.findOne({
        username: owner,
        "repoScanned.repository.name":repo
      })
    //   console.log(oldUser)
      if (oldUser){
        try{
          await ScanningActivity.updateOne({
            username: owner,
            "repoScanned.repository.name": repo
          },
          {
            $set: {
              "repoScanned.$[outer].repository.$[inner].filesPiiData": piiVulnerabilities,
              "repoScanned.$[outer].repository.$[inner].pdfReport": "pdfReportLink"
            }
          },
          {
            arrayFilters: [
              { "outer.repository.name": repo }, 
              { "inner.name": repo }           
            ]
          })
        return {message: "updated"}
      } catch(err){
        console.log(err)
        return {message: "Unable to update"}
      }
      }
}

async function createUser(owner, repo, piiVulnerabilities){
    try{
        const data = {
          username: owner,
          repoScanned: [{
            repository: [{
              name: repo,
              filesPiiData: [{
                piiData: piiVulnerabilities
              }],
              pdfReport: "pdfReportLink"
            }]
          }]
    
        }
        
        const scannerData = new ScanningActivity(data)
        const savedData = await scannerData.save()
        return {message: "New User Created"}
      } catch (err){
        console.log(err)
        return {message: "Error saving data"}
      }
}

async function addNewRepo(owner, repo, piiVulnerabilities){
    const oldUser = await ScanningActivity.findOne({
        username: owner,
      })
      console.log(oldUser)
      if (oldUser){
        try{
          await ScanningActivity.updateOne({
            username: owner,
            
          },{
            $push: {
              repoScanned: {
                repository: [{
                  name: repo,
                  filesPiiData: piiVulnerabilities,
                  pdfReport: "pdfReportLink", // Assuming you have a pdfReport variable
                  createdAt: new Date(),
                }],
              },
            }
        })
        return {message: "Added new Repo"}
      } catch(err){
        console.log(err)
        return {message: "Unable to add new repo"}
      }
      }
}

async function getData(owner, repo){
    try {
        const data = await ScanningActivity.findOne({
            username: owner,
            "repoScanned.repository.name":repo
          },{
            "repoScanned.$": 1
          })
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return {message: "Unable to fetch data."}
    }
}


export {updateExistingUser, createUser, addNewRepo, getData}