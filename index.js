const fetch = require("node-fetch");
const _ = require("lodash");
const fs = require("fs");


const readTextFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
  return lines;
};

const listFollowing = async (token, id, searchText) => {
  try {
    const apiUrl = `https://657a5yyhsb.execute-api.ap-southeast-1.amazonaws.com/production/profile?q=${searchText}`;
    
    const send = await fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization: "Bearer " + token,
        "x-custom-app-version-tag": "6.0.2",
      },
      referrer: "https://app.republik.gg/",
    });
    const res = await send.json();
    return res;
  } catch (err) {
    return err;
  }
};

const follow = async (token, id) => {
  try {
    const send = await fetch(
      `https://657a5yyhsb.execute-api.ap-southeast-1.amazonaws.com/production/profile/${id}/followers`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          authorization: "Bearer " + token,
          "content-type": "application/json; charset=UTF-8",
          "x-custom-app-version-tag": "6.0.2",
        },
        referrer: "https://app.republik.gg/",
        body: "{}",
        method: "POST",
      }
    );
    const res = await send.json();
    return res;
  } catch (err) {
    return err;
  }
};

const main = async () => {
  const token = "eyJraWQiOiI5bWc0WGsrajl6OXRxVXFWb3ZSUUR5d1lLdkZcL0ZWaHVXaTUrRXI1WDFuVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkZDM3YzFhZS1kNmIxLTQ1YjEtYTJkNy00M2QzZDJkNmEwMDkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2FjRTlUNHVCayIsImNvZ25pdG86dXNlcm5hbWUiOiJhOWU2OTg0My1hZDhlLTQ3MmEtYjZkZC1mYTA1NzUzNDhhYWEiLCJvcmlnaW5fanRpIjoiMjYzOTVmYjYtNmM3Zi00ZDA1LWE1NTYtMjJjMzVmNmJhNDk0IiwiYXVkIjoiM3U0ZGc1NzMyc3FyZ2dlbnUxNWI5NGpyYmkiLCJldmVudF9pZCI6IjMyNDFlYTQ5LWEwYjMtNGViYS04NWJiLTJjYTJlNDE4MTZlMiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk1NTQzNzI1LCJleHAiOjE2OTU1NDczMjUsImlhdCI6MTY5NTU0MzcyNSwianRpIjoiNDVhYWMzMTAtZThkYS00NmUyLWI4ZmUtZDhkODE5MGY5NDExIiwiZW1haWwiOiJpbmF5c2FuamF5YUBnbWFpbC5jb20ifQ.BNu21-f9KLhFcffSfrmKumyvsdKiF1rI6h0giah00cHuegZ023JLSmnRfPS8VRbVRnfSxosmB2AyQ-N1u0l-pv8d_mUdjfneeyUqsvSjX7-3gKldX1lrLsqSmVsmj_kVBVU1uSb6cBtzm6L0077o-Tzly_CAW0M6wMUqpKzYLUHTXvv4_w_gwV3P4qRXV8RUp-YhCY-qDdrKPu08UUtOehxTsZRPjZUKdHsAWF8F6HbYCuh5YFgFRXkClR-ndMFf3Xfy_A6rZr3nthtI-tekTeUuXD5B5FuUUSxmNwA4lVfJrbHLCJJKd2zyDe-jEItrGC_bwiuMYKwHUivSpZUEGQ"; // Gantilah dengan token Anda
  const userId = ""; // Gantilah dengan ID pengguna Anda
  const asciiArt = `
  +====================================================+
  |███████╗ ██████╗ ██╗     ███╗   ███╗███████╗██████╗ |
  |██╔════╝██╔═══██╗██║     ████╗ ████║██╔════╝██╔══██╗|
  |███████╗██║   ██║██║     ██╔████╔██║█████╗  ██████╔╝|
  |╚════██║██║   ██║██║     ██║╚██╔╝██║██╔══╝  ██╔══██╗|
  |███████║╚██████╔╝███████╗██║ ╚═╝ ██║███████╗██║  ██║|
  |╚══════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝|
  +====================================================+   
`;

console.log(asciiArt);
  let i = 0;
  const filePath = "text.txt"; 

  const textLines = readTextFile(filePath);

  for (const currentText of textLines) {
    console.log(`Current text for listFollowing: ${currentText}`);
    
    const getFollowing = await listFollowing(token, userId, currentText);
    if (!getFollowing.users) return console.log(getFollowing);
    
    await Promise.all(
      getFollowing.users.map(async (user) => {
        if (user.followStatus != "NONE") return;
        const doFollow = await follow(token, user.id);
        if (doFollow.followStatus) {
          console.log(
            `[${i++}] [${user.id}] ${user.displayName} (@${
              user.username
            }) | Status : ${doFollow.followStatus}`
          );
        } else {
          console.log(
            `[${i++}] [${user.id}] ${user.displayName} (@${
              user.username
            }) | Status : ${JSON.stringify(doFollow)}`
          );
        }
      })
    );
    
    
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 
  }
};

main();
