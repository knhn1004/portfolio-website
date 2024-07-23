export interface IQuestionRequest {
	firstName: string;
	lastName: string;
	organization: string;
	email: string;
	question: string;
	token?: string;
	[key: string]: any;
}
