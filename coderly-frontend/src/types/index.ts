export type ProjectStatus = 'IDEA' | 'IN_PROGRESS' | 'DONE';

export interface Tag {
    id: string;
    name: string;
}

export interface User {
    id: string;
    email: string;
    username: string;
    bio: string | null;
    githubUrl: string | null;
    phone?: string | null;
    telegramUsername?: string | null;
}

export interface Project {
    id: string;
    title: string;
    description: string; 
    status: ProjectStatus;
    githubUrl: string | null;
    demoUrl: string | null;
    createAt: string;
    updateAt: string
    owner: Pick<User, 'id' | 'username'>;
    tags: Tag[];
}
