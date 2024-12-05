import { User, Student } from '../../types/parent';

/**
 * Startup variables
 */
export type StartupVariables = {
	debug_ind?: number;
	parent: Omit<User, 'students' | 'password' | 'type'> & { id: string };
	students: Student[];
};

/**
 * Requests
 */
export type LaunchRequest = {
	type: 'launch';
};
export type IntentRequest = {
	type: 'intent';
	payload: IntentPayload;
};
export type PathRequest = {
	type: string; // which is the path
	payload: PathPayload;
};
export type TextRequest = {
	type: 'text';
	payload: string;
};
export type SuccessRequest = {
	type: 'success';
	payload?: any;
};
export type FailRequest = {
	type: 'fail';
};
export type ChoiceRequest =
	| {
			type: 'intent';
			payload: IntentPayload;
	  }
	| {
			type: string;
			payload: PathPayload;
	  };
export type VoiceflowRequest =
	| LaunchRequest
	| IntentRequest
	| PathRequest
	| TextRequest
	| SuccessRequest
	| FailRequest;

/**
 * Responses
 */
export type TextResponse = {
	time?: number;
	type: 'text';
	payload: {
		slate?: {
			id: string;
			content: {
				children: {
					text: string;
				}[];
			}[];
			messageDelayMilliseconds: number;
		};
		message: string;
		delay?: number;
	};
};
export type ChoiceResponse = {
	time: number;
	type: 'choice';
	payload: {
		message: string;
		buttons: {
			name: string;
			request: ChoiceRequest;
		}[];
	};
};
export type VoiceflowResponse =
	| {
			type: 'path' | 'end';
	  }
	| TextResponse
	| ChoiceResponse
	| LocationRequestResponse;

export type LocationRequestResponse = {
	time?: number;
	type: 'location_request';
	payload?: string;
	defaultPath?: number;
	paths?: {
		event: SuccessRequest | FailRequest;
	}[];
};

export type NotificationResultResponse = {
	time?: number;
	type: 'notification_result';
	payload: {
		notification_message: any;
		notification_metadata: any;
	};
	defaultPath?: number;
	paths?: {
		event: SuccessRequest | FailRequest;
	}[];
};

/**
 * Generic payloads
 */
type IntentPayload = {
	query: string;
	label: string;
	intent: {
		name: string;
	};
	actions: any[];
	entities: any[];
};
type PathPayload = {
	label: string;
	actions: any[];
};
