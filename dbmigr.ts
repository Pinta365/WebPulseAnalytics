
import "$std/dotenv/load.ts";

import { database } from "./db/db.ts";
import { Project } from "lib/commonTypes.ts";

// 1. Logga in i frontend, kolla vilket userid det blev och ange nedan
const userId = "01HDHFQCJJE7P259V512T7VQ5F";

// 2. Lista alla projectidn nedan
// Pintas:
//   01HCD7QH7ZWZ9HV7BSQ7NZZ6H4
//   01HCWZ4R85WCYKHD73A68C3KG1
for(const projectId of [
    "01HCD7RJCJ55YYYX0471FYPXNE",
    "01HCF6YRCKJTXZAFNRMY2W179G",
    "01HCF709JQFEDX6VYFS77PYFMR",
    "01HCWW2KT44T6W5HZ85NM0AE7P",
    "01HCYWXP93GAT1FNP8Q1TSC9C2"
]) {
    // Hämta projekt
    const projectObj = await database.get(["projects",projectId]);

    // Uppdatera user
    const project: Project = projectObj.value as Project;
    project.ownerId = userId;

    // Uppdatera nycklar
    await database.set(["projects",projectId],project);
    await database.set(["projects",userId,projectId],project);
    console.log(projectId + " done.");
}