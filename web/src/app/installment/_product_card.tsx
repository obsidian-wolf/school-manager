'use client';
import React from 'react';
import { formatCurrency } from '@/utils/format_currency';
import { Card } from '@/components/card';
import clsx from 'clsx';
import { Product } from '@/api/model';

export default function ProductCard({
	amount,
	product,
	index,
}: {
	amount: number;
	product: Product | undefined;
	index?: number;
}) {
	if (!product) {
		return null;
	}

	return (
		<Card
			className={clsx('bg-[#65c3c3]', {
				'h-80 animate-pulse': !product,
			})}
		>
			{/* {!medication ? (
				<div className="italic text-white h-full flex items-center justify-center">
					Loading...
				</div>
			) : ( */}
			<>
				<h3>Subscription Payment{index !== undefined ? ` #${index + 1}` : ''}</h3>
				<div className="pt-8 pb-5 border-b border-white">
					<div className="flex items-center text-lg">
						<div className="flex items-start md:items-center flex-col md:flex-row gap-4">
							<img
								className="h-16 rounded-xl"
								src={product?.url}
								alt={product?.name}
							/>
							<div className="text-white">
								{product?.name}{' '}
								<span className="ml-1">
									{product?.tier && (
										<strong className="font-semibold">
											Tier {product?.tier}
										</strong>
									)}
								</span>
							</div>
						</div>
						<div className="ml-auto">{formatCurrency(amount)}</div>
					</div>
				</div>
				<div className="font-semibold text-lg flex items-center justify-end py-4 border-b border-white">
					<div className="text-white">Subtotal</div>
					<div className="ml-auto">{formatCurrency(amount)}</div>
				</div>
				<div className="text-lg flex items-center justify-end py-4 border-b border-white">
					<div className="font-semibold text-white">Shipping</div>
					<div className="ml-auto">{formatCurrency(0)}</div>
				</div>
				<div className="font-semibold text-lg flex items-center justify-end pt-4">
					<div className="text-white pr-12">Total</div>
					<div>{formatCurrency(amount)}</div>
				</div>
			</>
			{/* )} */}
		</Card>
	);
}
