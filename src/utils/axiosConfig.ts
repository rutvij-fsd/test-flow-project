import axios from 'axios';

const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"; // Use environment variable

export const axiosInstance = axios.create({
  baseURL: "https://api.github.com/repos/adrianhajdin/project_chat_application/contents/",
  timeout: 10000,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3.raw'
  }
});
