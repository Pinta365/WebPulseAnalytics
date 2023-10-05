export interface SessionUser {
    userId: string;
    displayName: string;
    avatar: string;
}

export interface ProviderProfile {
    name: string; //"Pinta"
    id: string; //19735646
    avatar_url?: string; //"https://avatars.githubusercontent.com/u/19735646?v=4"
}

export type SupportedProviders = "github"; //Add more providers.. google and apple?

export interface DBUser {
    userId: string | undefined;
    displayName: string;
    avatar?: string;
    primaryProvider?: SupportedProviders;
    providers: {
        [key in SupportedProviders]?: ProviderProfile;
    };
}
