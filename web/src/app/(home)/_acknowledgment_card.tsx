'use client';
import React, { useEffect, useState } from 'react';
import { ToggleCard } from './_toggle_card';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';

const ACKNOWLEDGEMENTS = [
	{
		title: 'Terms & Conditions',
		subtitle: (
			<>
				I confirm that I have read and agree to EllieMD’s Terms and Conditions, including
				limitations on liability. I understand that EllieMD LLC is not a medical provider,
				pharmacy, or substitute for medical care.
			</>
		),
	},
	{
		title: 'Returns & Refunds Policy',
		subtitle: (
			<>
				I have read and accept EllieMD’s Returns & Refunds Policy. I understand that
				prescription products are non-returnable and I will not be refunded after receiving
				product. Questions or concerns about my order should be sent to support@elliemd.com.
			</>
		),
	},
	{
		title: 'Communication Consent',
		subtitle: (
			<>
				I verify that this is my email address and mobile number. I consent to receive email
				and text messages on my mobile phone. I understand that consent is not required to
				make a purchase. I also agree to the SMS terms stated in the Ellie MD’s Terms and
				Conditions. Message and data rates may apply. Reply HELP for help, or reply STOP to
				opt-out.
			</>
		),
	},
	{
		title: 'Subscription Acknowledgement ',
		subtitle: (
			<>
				I understand that I am purchasing a subscription product and consent to automatic
				charges for refills. Weight management products renew every three months as part of
				an annual subscription. I can cancel my subscription by emailing support@elliemd.com
			</>
		),
	},
];

export function AcknowledgementCard({
	isActive,
	onToggle,
	onSubmit,
	isComplete,
}: {
	isActive: boolean;
	isComplete: boolean;
	onToggle?: (isActive: boolean) => void;
	onSubmit?: () => void;
}) {
	const [checked, setChecked] = useState<boolean[]>(ACKNOWLEDGEMENTS.map(() => false));

	useEffect(() => {
		if (isComplete) {
			setChecked(ACKNOWLEDGEMENTS.map(() => true));
		}
	}, [isComplete]);

	return (
		<ToggleCard
			title="Acknowledgements & Consent"
			isComplete={isComplete}
			isActive={isActive}
			onToggle={onToggle}
		>
			{ACKNOWLEDGEMENTS.map((ack, i) => (
				<div key={i} className="mb-4">
					<Checkbox
						label={ack.title}
						subtitle={ack.subtitle}
						checked={checked[i]}
						onChange={(c) => {
							const newChecked = [...checked];
							newChecked[i] = c;
							setChecked(newChecked);
						}}
					/>
				</div>
			))}
			<div className="border-t border-[#9D9D9D] py-4 mt-8 font-semibold text-sm">
				Before placing an order you must consent to the above.
			</div>
			<div className="flex flex-col">
				<Button
					variant="primary"
					className="mt-4"
					type="submit"
					onClick={onSubmit}
					disabled={!checked.every((c) => c)}
				>
					Proceed to Payment
				</Button>
			</div>
		</ToggleCard>
	);
}
