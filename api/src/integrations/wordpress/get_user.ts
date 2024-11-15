import { api } from '.';

export type WPUser = {
	id?: number;
	username?: string;
	name?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	url?: string;
	description?: string;
	link?: string;
	locale?: string;
	nickname?: string;
	slug?: string;
	roles?: string[];
	registered_date?: string;
	capabilities?: {
		read?: boolean;
		level_0?: boolean;
		vc_access_rules_post_types?: string;
		'vc_access_rules_post_types/page'?: boolean;
		'vc_access_rules_post_types/cpt_layouts'?: boolean;
		subscriber?: boolean;
	};
	extra_capabilities?: {
		subscriber?: boolean;
	};
	avatar_urls?: {
		'24'?: string;
		'48'?: string;
		'96'?: string;
	};
	meta?: {
		persisted_preferences?: any[];
		dealer_id?: string;
	};
	acf?: any[];
	is_super_admin?: boolean;
	woocommerce_meta?: {
		variable_product_tour_shown?: string;
		activity_panel_inbox_last_read?: string;
		activity_panel_reviews_last_read?: string;
		categories_report_columns?: string;
		coupons_report_columns?: string;
		customers_report_columns?: string;
		orders_report_columns?: string;
		products_report_columns?: string;
		revenue_report_columns?: string;
		taxes_report_columns?: string;
		variations_report_columns?: string;
		dashboard_sections?: string;
		dashboard_chart_type?: string;
		dashboard_chart_interval?: string;
		dashboard_leaderboard_rows?: string;
		homepage_layout?: string;
		homepage_stats?: string;
		task_list_tracked_started_tasks?: string;
		help_panel_highlight_shown?: string;
		android_app_banner_dismissed?: string;
	};
	_links?: {
		self?: {
			href?: string;
		}[];
		collection?: {
			href?: string;
		}[];
	};
};

export async function getUser(email: string) {
	try {
		const { data } = await api.get<WPUser[]>(
			`/wp-json/wp/v2/users?context=edit&search=${email}`,
		);
		return data.find((u) => u.email?.toLocaleLowerCase() === email?.toLocaleLowerCase());
	} catch {
		return undefined;
	}
}
