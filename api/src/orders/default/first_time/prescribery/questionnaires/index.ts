import b12 from './b12';
import nadNasal from './nad_nasal';
import nad from './nad';
import pt141Nasal from './pt_141_nasal';
import pt141 from './pt_141';
import semaglutide from './semaglutide';
import sermorelin from './sermorelin';
import synapsin from './synapsin';
import tirzepatide from './tirzepatide';
import semaglutideSublingual from './semaglutide_sublingual';
import semaglutideMicrodose from './semaglutide_microdose';
import sermorelinTablets from './sermorelin_tablets';
import tirzepatideMicrodose from './tirzepatide_microdose';
import nadTier1 from './nad_tier_1';
import nadTier2 from './nad_tier_2';
import { createPatientDocument } from '../../../../../integrations/prescribery/doctalkgo/patient_document';

const questionnaires = {
	...b12,
	...nadNasal,
	...nad,
	...pt141Nasal,
	...pt141,
	...semaglutide,
	...sermorelin,
	...synapsin,
	...tirzepatide,
	...semaglutideSublingual,
	...sermorelinTablets,
	...semaglutideMicrodose,
	...tirzepatideMicrodose,
	...nadTier1,
	...nadTier2,
} as const;

export async function mapQuestionnaire(
	patientId: string,
	sku: keyof typeof questionnaires,
	answers: Record<string, string>[],
) {
	const questionnaire = questionnaires[sku];
	if (!questionnaire) return undefined;

	const parsedAnswers: Record<string, string>[] = [];
	let feet: string | undefined;
	let inches: string | undefined;
	for (const answer of answers) {
		if (answer.feet) {
			feet = answer.feet;
		} else if (answer.inches) {
			inches = answer.inches;
		} else {
			parsedAnswers.push(answer);
		}
	}
	if (feet && inches) {
		parsedAnswers.push({
			height: `${feet}'${inches}"`,
		});
	}

	function findAnswer(name: string) {
		const answer = parsedAnswers.find((a) => a[name])?.[name] || '';
		// replace all " with space
		return answer.replace(/"/g, '');
	}

	const mappedQuestionnaire = (
		await Promise.all(
			questionnaire.map(async (value) => {
				let answer = value.key && findAnswer(value.key);

				if ((value as any).document && answer) {
					try {
						answer = (await createPatientDocument(patientId, answer, value.key!))
							.document_file;
					} catch {
						//
					}
				} else if ((value as any).default && !answer) {
					answer = (value as any).default;
				}

				return {
					...value,
					answer,
				};
			}),
		)
	)
		.filter((r) => r.answer)
		.map((r) => ({
			entry_id: r.entry_id,
			answer: r.answer,
		}));
	// TODO: just for testing now
	if (mappedQuestionnaire.length === 0) {
		return [
			{
				...questionnaire[0],
				answer: 'Empty questionnaire',
			},
		];
	}
	return mappedQuestionnaire;
}
