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
  const token = ""; // Gantilah dengan token Anda
  const userId = ""; // Gantilah dengan ID pengguna Anda
  console.log(`salam solmerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr`);

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
