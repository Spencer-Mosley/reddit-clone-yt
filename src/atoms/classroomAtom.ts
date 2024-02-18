import {atom} from "recoil";

export interface Classroom {
    id: string;
    name: string;
    classMemberNames: string[];
    joincode: string;
    tenantId: string;
    title: string;
    userEmailAddress: string[];
    userTokens: string[];
    createdBy: string;
    dateAdded: string;
}

