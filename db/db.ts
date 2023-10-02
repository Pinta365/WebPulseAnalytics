import { DBUser } from "lib/commonTypes.ts"

const database = await Deno.openKv(Deno.env.get("DENO_KV_LOCAL_DATABASE") || undefined);

export { database };

export async function getUserinfoFromId(userId: string): Promise<DBUser> {
  try {
    const user = await database.get<DBUser>(["users", userId]);
    if (user?.value) {
      return user.value;
    } else {
      throw Error("User not found!");
    }
  } catch (error) {
    console.error(error);
    return {} as DBUser;
  }
}

export async function setUserinfoFromId(userId: string, user: DBUser) {
  try {
    return await database.set(["users", userId], user);    
  } catch (error) {
    console.error(error);
    return;
  }


}
