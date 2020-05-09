const fetch = require('node-fetch');
const config = require('../config/config.js');
const _ = require('lodash');
const defaultUserPassword = config.defaultUserPassword;
const userApiConfig = {
  userRoleEndPoint: config.endpoints.userRole,
  createUserEndPoint: config.endpoints.createUser,
  editUserEndPoint: config.endpoints.editUser,
  allUsersByRoleEndPoint: config.endpoints.allUsersByRole,
  createFileEndPoint: config.endpoints.createFile,
  editFileEndPoint: config.endpoints.editFile
};

const ManageUserController = {
  async fetchUserRoles(userRoleName) {
    const url = `${userApiConfig.userRoleEndPoint}`;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let finalUserResult = 'error';
    try {
      const userResult = await fetch(url, OPTIONS);
      finalUserResult = await userResult.json();
      // console.log('finalResult userRole : ' + JSON.stringify(finalUserResult));
    } catch (error) {
      console.log('error in fetching user roles : ' + error);
    }

    for (let user of finalUserResult) {
      if (user.userRoleName && user.userRoleName === userRoleName) {
        return user.id;
      }
    }
    return '-1';
  },

  async addNewUser(
    userName,
    userAccountName,
    userRoleId,
    userAddress,
    userMobileNumber,
    userMonthlyTarget,
    userId,
    action,
    fileData,
    fileName,
    fileId
  ) {
    let url = '';
    let fileProcessUrl = '';
    let httpMethodType = 'POST';
    if(action === 'create') {
      userId = '';
      fileId = '';
      url = `${userApiConfig.createUserEndPoint}`;
      fileProcessUrl = `${userApiConfig.createFileEndPoint}`;
    } else {
      url = `${userApiConfig.editUserEndPoint}`;
      fileProcessUrl = `${userApiConfig.editFileEndPoint}`;
      httpMethodType = 'PUT';
    }

    const userPass = defaultUserPassword;

    const currentTime = new Date().getTime();

    let reqBody = {
        fileId: `${fileId}`,
        fileName: `${fileName}`,
        fileData: `${fileData}`
    };

    let OPTIONS = {
      method: httpMethodType,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    };
    let finalResult = 'error';
    try {
      const result = await fetch(fileProcessUrl, OPTIONS);
      finalResult = await result.json();
      // console.log('finalResult : ' + JSON.stringify(finalResult));
    } catch (error) {
      console.log(
          `error in creating a file for user : ` + error
      );
    }

    const newFile = finalResult;

    if (finalResult === 'error' || finalResult.code) {
      return 'error';
    } else {
      reqBody = {
        id: `${userId}`,
        userName: `${userName}`,
        userPass: `${userPass}`,
        userAccountName: `${userAccountName}`,
        userAddress: `${userAddress}`,
        userMobileNumber: `${userMobileNumber}`,
        userMonthlyTarget: `${userMonthlyTarget}`,
        createdOn: `${currentTime}`,
        userRole: {
          id: `${userRoleId}`
        },
        file: {
          id: `${newFile.id}`
        }
      };

      OPTIONS = {
        method: httpMethodType,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      };
      finalResult = 'error';
      try {
        const result = await fetch(url, OPTIONS);
        finalResult = await result.json();
        //   console.log('finalResult : ' + JSON.stringify(finalResult));
      } catch (error) {
        console.log(
            `error in creating a user with roleId ${userRoleId} : ` + error
        );
      }
      if (!_.isEmpty(finalResult)) {
        finalResult = 'success';
      }
    }
    return finalResult;
  },

  async fetchAllUsersByRole(userRoleId) {
    const url = `${userApiConfig.allUsersByRoleEndPoint}` + userRoleId;
    const OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let finalUserResult = 'error';
    try {
      const userResult = await fetch(url, OPTIONS);
      finalUserResult = await userResult.json();
      // console.log('finalResult users : ' + JSON.stringify(finalUserResult));
      let allUsers = [];

      for (let tempUser of finalUserResult) {
        let user = {};
        user.userAccountName = tempUser.userAccountName;
        user.userMobileNumber = tempUser.userMobileNumber;
        user.userMonthlyTarget = tempUser.userMonthlyTarget;
        user.userAddress = tempUser.userAddress;
        user.userId = tempUser.id;
        user.userImage = tempUser.file.fileName;
        user.userImageId = tempUser.file.id;
        allUsers.push(user);
      }
      return allUsers;
    } catch (error) {
      console.log('error in fetching user roles : ' + error);
    }
    return '[]';
  }
};

module.exports = ManageUserController;
