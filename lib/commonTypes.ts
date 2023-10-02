export interface SessionData {
    isAuthed: boolean;
    userId: string;
    userName: string;
    avatar: string;
}

export interface DBUser {
    login: string; //"Pinta365",
    name: string; //"Pinta",
    id: string; //19735646,
    avatar_url: string; //"https://avatars.githubusercontent.com/u/19735646?v=4",
    url: string; //"https://api.github.com/users/Pinta365",
    html_url: string; //"https://github.com/Pinta365",;
  }