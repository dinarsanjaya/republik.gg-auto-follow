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
  const token = "eyJraWQiOiI5bWc0WGsrajl6OXRxVXFWb3ZSUUR5d1lLdkZcL0ZWaHVXaTUrRXI1WDFuVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjYzYyYmIwOC0xNzJkLTQyOWEtYmMyYy1jZjNkNzNhMzJmNGIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX2FjRTlUNHVCayIsImNvZ25pdG86dXNlcm5hbWUiOiI2N2MwNmE4Ny1mYjNkLTRjNmEtOTJkOC04YzJhZGE3YjViYjgiLCJvcmlnaW5fanRpIjoiMjFmODA1ZTgtMTlmOC00ZTRlLTliMzYtZmIzNzlmYTMyYjA3IiwiYXVkIjoiM3U0ZGc1NzMyc3FyZ2dlbnUxNWI5NGpyYmkiLCJldmVudF9pZCI6IjU4ZmMxMmY0LTJlNTEtNDIxOC1iNTE1LTkyMTBjODYxNTVkMiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk1NDU0NDY4LCJleHAiOjE2OTU1NDMxMDYsImlhdCI6MTY5NTUzOTUwNiwianRpIjoiMjRkMTc5MDAtMGFiYy00NDhmLTgzMzktNzZlMDEwMGE3M2E3IiwiZW1haWwiOiJla29lZmZlbmRpNjY3QGdtYWlsLmNvbSJ9.Md6vfrnzO6mAUBzRcpW5fw6yjVyno0upRSMZdcjjCOFOSEq6iZ7qxlxznoq93LAELfW0EYWIJRe_SpKRKbAPvV1gqTBJAUSJ5UWvQ6w_3CVEcpVXZN7f8yfdkMOrMptoGkTY2AgTS7L5YzQPL9hmgHgwDCD3peOnZk_EDwHiqS2IDjCvgIKf7fVYYH_pt998mki61q53fJyvK-dvIsbCxPJ3PiNWwUILjLFrrFUNzNAjffjhgQDyNceCmr2nizt7KHZ1Fy1kLyGhWQrCE3awpTTrHI-DpAiQ93qSr4pX41MLe5Fh49vFIUC_2CB_nFmtBg7P3oXcrLHFqkSR_CNkDA"; // Gantilah dengan token Anda
  const userId = "67c06a87-fb3d-4c6a-92d8-8c2ada7b5bb8"; // Gantilah dengan ID pengguna Anda
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
