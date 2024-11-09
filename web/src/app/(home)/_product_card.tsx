'use client';
import React from 'react';
import { formatCurrency } from '@/utils/format_currency';
import { OrderDetails } from '@/api/model';
import { Card } from '@/components/card';
import clsx from 'clsx';

export default function ProductCard({ orderDetails }: { orderDetails: OrderDetails | undefined }) {
	if (!orderDetails) {
		return null;
	}
	const isAllInstallments = orderDetails.products.every((product) => product.payOverTimePlan);
	return (
		<Card className={clsx('bg-[#65c3c3]')}>
			<h3>PRODUCTS IN CART</h3>

			{isAllInstallments ? (
				<div className="pt-8 pb-5 flex flex-col gap-4">
					{orderDetails.products.map((product, i) => (
						<div
							key={product.name + (product.tier || '') + i}
							className="flex flex-col md:items-center md:flex-row text-lg gap-y-6"
						>
							<div className="flex items-center flex-row gap-4">
								<img
									className="h-16 rounded-xl"
									src={product?.url}
									alt={product?.name}
								/>
								<div className="text-white">
									{product?.name}{' '}
									<span className="ml-1">
										{product?.tier && (
											<strong className="font-semibold whitespace-nowrap">
												Tier {product?.tier}
											</strong>
										)}
									</span>
								</div>
							</div>
							<div className="md:ml-auto md:text-right text-sm md:pl-4">
								Payment Options Below
							</div>
						</div>
					))}
				</div>
			) : (
				<>
					<div className="pt-8 pb-5 border-b border-white flex flex-col gap-4">
						{orderDetails.products.map((product, i) => (
							<div
								key={product.name + (product.tier || '') + i}
								className="flex items-center text-lg"
							>
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
								<div className="ml-auto">
									{formatCurrency(
										// TODO: upgrade options
										product.retailPrice * product.monthSupply
									)}
								</div>
							</div>
						))}
					</div>
					<div className="font-semibold text-lg flex items-center justify-end py-4 border-b border-white">
						<div className="text-white">Subtotal</div>
						<div className="ml-auto">{formatCurrency(orderDetails.fullPrice)}</div>
					</div>
					<div className="text-lg flex items-center justify-end py-4 border-b border-white">
						<div className="font-semibold text-white">Shipping</div>
						<div className="ml-auto">{formatCurrency(0)}</div>
					</div>
					<div className="font-semibold text-lg flex items-center justify-end pt-4">
						<div className="text-white pr-12">Total</div>
						<div>{formatCurrency(orderDetails.fullPrice)}</div>
					</div>
				</>
			)}
		</Card>
	);
}
