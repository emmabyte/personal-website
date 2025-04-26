interface ContactPostSuccessResponse {
	success: true;
	message: string;
}

interface ContactPostErrorResponse {
	success: false;
	message: string;
}

export type ContactPostResponse = ContactPostSuccessResponse | ContactPostErrorResponse;
