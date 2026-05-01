import { Client, Databases } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

const client = new Client()
  .setProject("695e45d5002f5d9d2ede")
  .setEndpoint("https://fra.cloud.appwrite.io/v1");

export const databases = new Databases(client);
export default client;
