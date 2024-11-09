/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../../controllers/user_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PrescriberyController } from './../../controllers/prescribery_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PayController } from './../../controllers/pay_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrderController } from './../../controllers/order_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HeartbeatController } from './../../controllers/heartbeat_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DemoController } from './../../controllers/demo_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../../controllers/auth_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AppointmentController } from './../../controllers/appointment_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdHocController } from './../../controllers/ad_hoc_controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from './../../controllers/admin_controller';
import { expressAuthentication } from './middlewares/authentication_middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Record_string.string_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"string"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuestionnaireRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"answers":{"dataType":"array","array":{"dataType":"refAlias","ref":"Record_string.string_"},"required":true},"id_document":{"dataType":"string"},"entry":{"dataType":"string","required":true},"product":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_PrescriberyPaymentRequest.Exclude_keyofPrescriberyPaymentRequest.assessment_token-or-plan-or-billing-or-shipping__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"first_name":{"dataType":"string","required":true},"last_name":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"dob":{"dataType":"string","required":true},"gender":{"dataType":"string","required":true},"lead_id":{"dataType":"double"},"assessment_id":{"dataType":"double"},"redirect_url":{"dataType":"string","required":true},"patient_id":{"dataType":"string"},"isSyncUpgrade":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_PrescriberyPaymentRequest.assessment_token-or-plan-or-billing-or-shipping_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_PrescriberyPaymentRequest.Exclude_keyofPrescriberyPaymentRequest.assessment_token-or-plan-or-billing-or-shipping__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrescriberyReassessmentMedication": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Semaglutide_Tier_1_Increase_my_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_1_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_1_Switch_to_Tirzepatide"]},{"dataType":"enum","enums":["Semaglutide_Tier_2_Increase_my_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_2_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_2_Decrease_my_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_2_Switch_to_Tirzepatide"]},{"dataType":"enum","enums":["Semaglutide_Tier_3_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_3_Decrease_my_dose"]},{"dataType":"enum","enums":["Semaglutide_Tier_3_Switch_to_Tirzepatide"]},{"dataType":"enum","enums":["Tirzepatide_Tier_1_Increase_my_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_1_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_1_Switch_to_Semaglutide"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2_Increase_my_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2_Decrease_my_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2_Switch_to_Semaglutide"]},{"dataType":"enum","enums":["Tirzepatide_Tier_3_Stay_on_my_current_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_3_Decrease_my_dose"]},{"dataType":"enum","enums":["Tirzepatide_Tier_3_Switch_to_Semaglutide"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrescriberyReassessmentPaymentRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_PrescriberyPaymentRequest.assessment_token-or-plan-or-billing-or-shipping_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"assessment_token":{"dataType":"string","required":true},"plan":{"dataType":"nestedObjectLiteral","nestedProperties":{"medication":{"ref":"PrescriberyReassessmentMedication","required":true},"amount":{"dataType":"string"}},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SearchPatient": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"created_date":{"dataType":"string","required":true},"weight":{"dataType":"double","required":true},"height":{"dataType":"string","required":true},"city":{"dataType":"string","required":true},"state":{"dataType":"string","required":true},"zip_code":{"dataType":"string","required":true},"dob":{"dataType":"string","required":true},"patient_id":{"dataType":"double","required":true},"full_name":{"dataType":"string","required":true},"record_id":{"dataType":"string","required":true},"active":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["active"]},{"dataType":"enum","enums":["inactive"]}],"required":true},"last_name":{"dataType":"string","required":true},"mobile":{"dataType":"string","required":true},"created_time":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"first_name":{"dataType":"string","required":true},"gender":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["male"]},{"dataType":"enum","enums":["female"]}],"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_User.Exclude_keyofUser.dob-or-gender-or-wp-or-dealerId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"prescriberyPatient":{"ref":"SearchPatient"},"firstName":{"dataType":"string","required":true},"middleName":{"dataType":"string"},"lastName":{"dataType":"string","required":true},"phone":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_User.dob-or-gender-or-wp-or-dealerId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_User.Exclude_keyofUser.dob-or-gender-or-wp-or-dealerId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "USStateCode": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["AL"]},{"dataType":"enum","enums":["AK"]},{"dataType":"enum","enums":["AZ"]},{"dataType":"enum","enums":["AR"]},{"dataType":"enum","enums":["CA"]},{"dataType":"enum","enums":["CO"]},{"dataType":"enum","enums":["CT"]},{"dataType":"enum","enums":["DE"]},{"dataType":"enum","enums":["FL"]},{"dataType":"enum","enums":["GA"]},{"dataType":"enum","enums":["HI"]},{"dataType":"enum","enums":["ID"]},{"dataType":"enum","enums":["IL"]},{"dataType":"enum","enums":["IN"]},{"dataType":"enum","enums":["IA"]},{"dataType":"enum","enums":["KS"]},{"dataType":"enum","enums":["KY"]},{"dataType":"enum","enums":["LA"]},{"dataType":"enum","enums":["ME"]},{"dataType":"enum","enums":["MD"]},{"dataType":"enum","enums":["MA"]},{"dataType":"enum","enums":["MI"]},{"dataType":"enum","enums":["MN"]},{"dataType":"enum","enums":["MS"]},{"dataType":"enum","enums":["MO"]},{"dataType":"enum","enums":["MT"]},{"dataType":"enum","enums":["NE"]},{"dataType":"enum","enums":["NV"]},{"dataType":"enum","enums":["NH"]},{"dataType":"enum","enums":["NJ"]},{"dataType":"enum","enums":["NM"]},{"dataType":"enum","enums":["NY"]},{"dataType":"enum","enums":["NC"]},{"dataType":"enum","enums":["ND"]},{"dataType":"enum","enums":["OH"]},{"dataType":"enum","enums":["OK"]},{"dataType":"enum","enums":["OR"]},{"dataType":"enum","enums":["PA"]},{"dataType":"enum","enums":["RI"]},{"dataType":"enum","enums":["SC"]},{"dataType":"enum","enums":["SD"]},{"dataType":"enum","enums":["TN"]},{"dataType":"enum","enums":["TX"]},{"dataType":"enum","enums":["UT"]},{"dataType":"enum","enums":["VT"]},{"dataType":"enum","enums":["VA"]},{"dataType":"enum","enums":["WA"]},{"dataType":"enum","enums":["WV"]},{"dataType":"enum","enums":["WI"]},{"dataType":"enum","enums":["WY"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Address": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"Omit_User.dob-or-gender-or-wp-or-dealerId_"},{"dataType":"nestedObjectLiteral","nestedProperties":{"stateCode":{"ref":"USStateCode","required":true},"postcode":{"dataType":"string","required":true},"city":{"dataType":"string","required":true},"address2":{"dataType":"string"},"address":{"dataType":"string","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BillingAndShippingInfoRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"billing":{"ref":"Address","required":true},"shipping":{"ref":"Address","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ParsedFormidableUser": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"stateCode":{"dataType":"string","required":true},"state":{"dataType":"string","required":true},"postcode":{"dataType":"string","required":true},"city":{"dataType":"string","required":true},"address2":{"dataType":"string","required":true},"address":{"dataType":"string","required":true},"sponsor_id":{"dataType":"string","required":true},"brand_id":{"dataType":"string","required":true},"phone":{"dataType":"string","required":true},"dealer_id":{"dataType":"string","required":true},"dob":{"dataType":"datetime","required":true},"gender":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"last_name":{"dataType":"string","required":true},"middle_name":{"dataType":"string","required":true},"first_name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WPUser": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"_links":{"dataType":"nestedObjectLiteral","nestedProperties":{"collection":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"href":{"dataType":"string"}}}},"self":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"href":{"dataType":"string"}}}}}},"woocommerce_meta":{"dataType":"nestedObjectLiteral","nestedProperties":{"android_app_banner_dismissed":{"dataType":"string"},"help_panel_highlight_shown":{"dataType":"string"},"task_list_tracked_started_tasks":{"dataType":"string"},"homepage_stats":{"dataType":"string"},"homepage_layout":{"dataType":"string"},"dashboard_leaderboard_rows":{"dataType":"string"},"dashboard_chart_interval":{"dataType":"string"},"dashboard_chart_type":{"dataType":"string"},"dashboard_sections":{"dataType":"string"},"variations_report_columns":{"dataType":"string"},"taxes_report_columns":{"dataType":"string"},"revenue_report_columns":{"dataType":"string"},"products_report_columns":{"dataType":"string"},"orders_report_columns":{"dataType":"string"},"customers_report_columns":{"dataType":"string"},"coupons_report_columns":{"dataType":"string"},"categories_report_columns":{"dataType":"string"},"activity_panel_reviews_last_read":{"dataType":"string"},"activity_panel_inbox_last_read":{"dataType":"string"},"variable_product_tour_shown":{"dataType":"string"}}},"is_super_admin":{"dataType":"boolean"},"acf":{"dataType":"array","array":{"dataType":"any"}},"meta":{"dataType":"nestedObjectLiteral","nestedProperties":{"dealer_id":{"dataType":"string"},"persisted_preferences":{"dataType":"array","array":{"dataType":"any"}}}},"avatar_urls":{"dataType":"nestedObjectLiteral","nestedProperties":{"24":{"dataType":"string"},"48":{"dataType":"string"},"96":{"dataType":"string"}}},"extra_capabilities":{"dataType":"nestedObjectLiteral","nestedProperties":{"subscriber":{"dataType":"boolean"}}},"capabilities":{"dataType":"nestedObjectLiteral","nestedProperties":{"subscriber":{"dataType":"boolean"},"vc_access_rules_post_types/cpt_layouts":{"dataType":"boolean"},"vc_access_rules_post_types/page":{"dataType":"boolean"},"vc_access_rules_post_types":{"dataType":"string"},"level_0":{"dataType":"boolean"},"read":{"dataType":"boolean"}}},"registered_date":{"dataType":"string"},"roles":{"dataType":"array","array":{"dataType":"string"}},"slug":{"dataType":"string"},"nickname":{"dataType":"string"},"locale":{"dataType":"string"},"link":{"dataType":"string"},"description":{"dataType":"string"},"url":{"dataType":"string"},"email":{"dataType":"string"},"last_name":{"dataType":"string"},"first_name":{"dataType":"string"},"name":{"dataType":"string"},"username":{"dataType":"string"},"id":{"dataType":"double"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Wp": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"user":{"ref":"WPUser"},"formidableUser":{"ref":"ParsedFormidableUser"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"phone":{"dataType":"string","required":true},"gender":{"dataType":"string","required":true},"dob":{"dataType":"datetime","required":true},"dealerId":{"dataType":"double","required":true},"email":{"dataType":"string","required":true},"lastName":{"dataType":"string","required":true},"middleName":{"dataType":"string"},"firstName":{"dataType":"string","required":true},"wp":{"ref":"Wp","required":true},"prescriberyPatient":{"ref":"SearchPatient"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PersonalInfo": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"user":{"ref":"User","required":true},"shipping":{"ref":"Address","required":true},"billing":{"ref":"Address","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductPricing": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"uplineVolume":{"dataType":"double","required":true},"psvAmount":{"dataType":"double","required":true},"wholesalePrice":{"dataType":"double","required":true},"retailPrice":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProductId": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["semaglutide_tier_1"]},{"dataType":"enum","enums":["semaglutide_tier_2"]},{"dataType":"enum","enums":["semaglutide_tier_3"]},{"dataType":"enum","enums":["tirzepatide_tier_1"]},{"dataType":"enum","enums":["tirzepatide_tier_2"]},{"dataType":"enum","enums":["tirzepatide_tier_3"]},{"dataType":"enum","enums":["b12"]},{"dataType":"enum","enums":["nad_injection"]},{"dataType":"enum","enums":["nad_injection_1"]},{"dataType":"enum","enums":["nad_injection_2"]},{"dataType":"enum","enums":["nad_nasal_spray"]},{"dataType":"enum","enums":["sermorelin"]},{"dataType":"enum","enums":["synapsin"]},{"dataType":"enum","enums":["pt_141_injection"]},{"dataType":"enum","enums":["pt_141_nasal_spray"]},{"dataType":"enum","enums":["semaglutide_sublingual_tier_1"]},{"dataType":"enum","enums":["semaglutide_sublingual_tier_2"]},{"dataType":"enum","enums":["semaglutide_sublingual_tier_3"]},{"dataType":"enum","enums":["sermorelin_tablets"]},{"dataType":"enum","enums":["semaglutide_microdose"]},{"dataType":"enum","enums":["tirzepatide_microdose"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TrinityProduct": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Product 1"]},{"dataType":"enum","enums":["Product 2"]},{"dataType":"enum","enums":["Product 3"]},{"dataType":"enum","enums":["Product 4"]},{"dataType":"enum","enums":["Product 5"]},{"dataType":"enum","enums":["Product 6"]},{"dataType":"enum","enums":["Product 7"]},{"dataType":"enum","enums":["Product 9"]},{"dataType":"enum","enums":["Product 10"]},{"dataType":"enum","enums":["Product 11"]},{"dataType":"enum","enums":["Product 12"]},{"dataType":"enum","enums":["Product 13"]},{"dataType":"enum","enums":["Product 14"]},{"dataType":"enum","enums":["Product 15"]},{"dataType":"enum","enums":["Product 16"]},{"dataType":"enum","enums":["Product 17"]},{"dataType":"enum","enums":["Product 18"]},{"dataType":"enum","enums":["Product 20"]},{"dataType":"enum","enums":["Product 22"]},{"dataType":"enum","enums":["Product 23"]},{"dataType":"enum","enums":["Product 24"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Product": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"ProductPricing"},{"dataType":"nestedObjectLiteral","nestedProperties":{"trinityId":{"ref":"TrinityProduct"},"prescriberySource":{"dataType":"string"},"prescriberyTemplate":{"dataType":"string"},"sku":{"dataType":"string"},"monthSupply":{"dataType":"double","required":true},"payOverTimePlan":{"dataType":"array","array":{"dataType":"double"}},"url":{"dataType":"string","required":true},"tier":{"dataType":"double"},"type":{"dataType":"enum","enums":["medication"],"required":true},"name":{"dataType":"string","required":true},"id":{"ref":"ProductId","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"PersonalInfo"},{"dataType":"nestedObjectLiteral","nestedProperties":{"payOverTimePlan":{"dataType":"array","array":{"dataType":"double"},"required":true},"fullPrice":{"dataType":"double","required":true},"products":{"dataType":"array","array":{"dataType":"refAlias","ref":"Product"},"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminLoginRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Patient": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string","required":true},"state":{"dataType":"string","required":true},"smoking_status":{"dataType":"string","required":true},"patient_id":{"dataType":"double"},"record_id":{"dataType":"string","required":true},"profile_img":{"dataType":"string","required":true},"postal_code":{"dataType":"string","required":true},"marital_status":{"dataType":"string","required":true},"mobile":{"dataType":"string","required":true},"last_name":{"dataType":"string","required":true},"identifier":{"dataType":"nestedObjectLiteral","nestedProperties":{"value":{"dataType":"string","required":true},"use":{"dataType":"string","required":true}},"required":true},"weigh":{"dataType":"string","required":true},"height":{"dataType":"string","required":true},"gender":{"dataType":"string","required":true},"first_name":{"dataType":"string","required":true},"employment_status":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"dob":{"dataType":"string","required":true},"district":{"dataType":"string"},"country":{"dataType":"string","required":true},"communication_type":{"dataType":"string"},"city":{"dataType":"string","required":true},"blood_group":{"dataType":"string"},"address_line2":{"dataType":"string"},"address_line1":{"dataType":"string","required":true},"id":{"dataType":"double"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailableSlot": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"member_id":{"dataType":"double","required":true},"end_time":{"dataType":"string","required":true},"start_time":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.AvailableSlot-Array_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"array","array":{"dataType":"refAlias","ref":"AvailableSlot"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailableSlots": {
        "dataType": "refAlias",
        "type": {"ref":"Record_string.AvailableSlot-Array_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSyncAppointmentRequest": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"endTime":{"dataType":"string","required":true},"startTime":{"dataType":"string","required":true},"startDate":{"dataType":"string","required":true},"memberId":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderInstallmentDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"intersection","subSchemas":[{"ref":"PersonalInfo"},{"dataType":"nestedObjectLiteral","nestedProperties":{"amount":{"dataType":"double","required":true},"product":{"ref":"Product","required":true},"installmentIndex":{"dataType":"double","required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReassessmentFromMedication": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Semaglutide_Tier_1"]},{"dataType":"enum","enums":["Semaglutide_Tier_2"]},{"dataType":"enum","enums":["Semaglutide_Tier_3"]},{"dataType":"enum","enums":["Semaglutide_Sublingual_Tier_1"]},{"dataType":"enum","enums":["Semaglutide_Sublingual_Tier_2"]},{"dataType":"enum","enums":["Semaglutide_Sublingual_Tier_3"]},{"dataType":"enum","enums":["Tirzepatide_Tier_1"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2"]},{"dataType":"enum","enums":["Tirzepatide_Tier_3"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReassessmentToMedication": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["Semaglutide_Tier_2"]},{"dataType":"enum","enums":["Semaglutide_Tier_3"]},{"dataType":"enum","enums":["Semaglutide_Sublingual_Tier_2"]},{"dataType":"enum","enums":["Semaglutide_Sublingual_Tier_3"]},{"dataType":"enum","enums":["Tirzepatide_Tier_2"]},{"dataType":"enum","enums":["Tirzepatide_Tier_3"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PrescriberyMedication": {
        "dataType": "refAlias",
        "type": {"ref":"PrescriberyReassessmentMedication","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.post('/user/questionnaire',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createQuestionnaire)),

            async function UserController_createQuestionnaire(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"QuestionnaireRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'createQuestionnaire',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/user/questionnaire/pay',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getQuestionnairePaymentUrl)),

            async function UserController_getQuestionnairePaymentUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"forceCreate":{"dataType":"boolean"},"entry":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getQuestionnairePaymentUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/prescribery/webhook',
            authenticateMiddleware([{"jwt":["prescribery"]}]),
            ...(fetchMiddlewares<RequestHandler>(PrescriberyController)),
            ...(fetchMiddlewares<RequestHandler>(PrescriberyController.prototype.webhook)),

            async function PrescriberyController_webhook(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Record_string.any_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PrescriberyController();

              await templateService.apiHandler({
                methodName: 'webhook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/prescribery/pay',
            authenticateMiddleware([{"jwt":["prescribery"]}]),
            ...(fetchMiddlewares<RequestHandler>(PrescriberyController)),
            ...(fetchMiddlewares<RequestHandler>(PrescriberyController.prototype.getReassessmentCheckoutUrl)),

            async function PrescriberyController_getReassessmentCheckoutUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PrescriberyReassessmentPaymentRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PrescriberyController();

              await templateService.apiHandler({
                methodName: 'getReassessmentCheckoutUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.createOrderAndRedirect)),

            async function PayController_createOrderAndRedirect(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    id: {"in":"query","name":"id","required":true,"dataType":"string"},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'createOrderAndRedirect',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/pay/billing-and-shipping/:orderId',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.submitBillingAndShipping)),

            async function PayController_submitBillingAndShipping(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    request: {"in":"body","name":"request","required":true,"ref":"BillingAndShippingInfoRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'submitBillingAndShipping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/details/:orderId',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.getOrderDetails)),

            async function PayController_getOrderDetails(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'getOrderDetails',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/nexio-pay-in-full/:orderId/url',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.getNexioPayInFullPaymentUrl)),

            async function PayController_getNexioPayInFullPaymentUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    reset: {"default":false,"in":"query","name":"reset","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'getNexioPayInFullPaymentUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/pay/nexio-pay-in-full/:orderId/process',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.processNexioPayInFullPayment)),

            async function PayController_processNexioPayInFullPayment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    nexioPaymentId: {"in":"query","name":"nexioPaymentId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'processNexioPayInFullPayment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/nexio-pay-over-time/:orderId/url',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.getNexioPayOverTimePaymentUrl)),

            async function PayController_getNexioPayOverTimePaymentUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    reset: {"default":false,"in":"query","name":"reset","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'getNexioPayOverTimePaymentUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/pay/nexio-pay-over-time/:orderId/process',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.processNexioPayOverTimePayment)),

            async function PayController_processNexioPayOverTimePayment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    nexioPaymentId: {"in":"query","name":"nexioPaymentId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'processNexioPayOverTimePayment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/afterpay/confirm',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.processAfterpayPaymentConfirm)),

            async function PayController_processAfterpayPaymentConfirm(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    orderToken: {"in":"query","name":"orderToken","required":true,"dataType":"string"},
                    orderId: {"in":"query","name":"orderId","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'processAfterpayPaymentConfirm',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/afterpay/cancel',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.processAfterpayPaymentCancel)),

            async function PayController_processAfterpayPaymentCancel(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    orderToken: {"in":"query","name":"orderToken","required":true,"dataType":"string"},
                    orderId: {"in":"query","name":"orderId","required":true,"dataType":"string"},
                    status: {"in":"query","name":"status","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'processAfterpayPaymentCancel',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/pay/afterpay/checkout/:orderId',
            ...(fetchMiddlewares<RequestHandler>(PayController)),
            ...(fetchMiddlewares<RequestHandler>(PayController.prototype.getAfterpayCheckoutUrl)),

            async function PayController_getAfterpayCheckoutUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new PayController();

              await templateService.apiHandler({
                methodName: 'getAfterpayCheckoutUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/order/cancel/:orderId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrderController)),
            ...(fetchMiddlewares<RequestHandler>(OrderController.prototype.cancelOrder)),

            async function OrderController_cancelOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrderController();

              await templateService.apiHandler({
                methodName: 'cancelOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/heartbeat',
            ...(fetchMiddlewares<RequestHandler>(HeartbeatController)),
            ...(fetchMiddlewares<RequestHandler>(HeartbeatController.prototype.classHeartbeat)),

            async function HeartbeatController_classHeartbeat(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HeartbeatController();

              await templateService.apiHandler({
                methodName: 'classHeartbeat',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/demo/generate-questionnaire',
            ...(fetchMiddlewares<RequestHandler>(DemoController)),
            ...(fetchMiddlewares<RequestHandler>(DemoController.prototype.generateQuestionnaire)),

            async function DemoController_generateQuestionnaire(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DemoController();

              await templateService.apiHandler({
                methodName: 'generateQuestionnaire',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/demo/generate-questionnaire-pay-url',
            ...(fetchMiddlewares<RequestHandler>(DemoController)),
            ...(fetchMiddlewares<RequestHandler>(DemoController.prototype.generateQuestionnairePayUrl)),

            async function DemoController_generateQuestionnairePayUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DemoController();

              await templateService.apiHandler({
                methodName: 'generateQuestionnairePayUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/demo/generate-reassessment',
            ...(fetchMiddlewares<RequestHandler>(DemoController)),
            ...(fetchMiddlewares<RequestHandler>(DemoController.prototype.generateReassessment)),

            async function DemoController_generateReassessment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    email: {"default":"louischarlesblok7777@gmail.com","in":"query","name":"email","dataType":"string"},
                    medication: {"default":"Semaglutide_Tier_1_Increase_my_dose","in":"query","name":"medication","ref":"PrescriberyReassessmentMedication"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DemoController();

              await templateService.apiHandler({
                methodName: 'generateReassessment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/demo/temp',
            ...(fetchMiddlewares<RequestHandler>(DemoController)),
            ...(fetchMiddlewares<RequestHandler>(DemoController.prototype.temp)),

            async function DemoController_temp(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new DemoController();

              await templateService.apiHandler({
                methodName: 'temp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/auth/admin-login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.adminLogin)),

            async function AuthController_adminLogin(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AdminLoginRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'adminLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/test',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.test)),

            async function AuthController_test(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'test',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/trinity-submissions',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.processSubmissions)),

            async function AuthController_processSubmissions(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    preview: {"default":true,"in":"query","name":"preview","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'processSubmissions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/demo',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.demo)),

            async function AuthController_demo(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    email: {"in":"query","name":"email","required":true,"dataType":"string"},
                    dob: {"in":"query","name":"dob","required":true,"dataType":"datetime"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'demo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/appointment/:orderId',
            ...(fetchMiddlewares<RequestHandler>(AppointmentController)),
            ...(fetchMiddlewares<RequestHandler>(AppointmentController.prototype.getAppointments)),

            async function AppointmentController_getAppointments(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AppointmentController();

              await templateService.apiHandler({
                methodName: 'getAppointments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/appointment/:orderId',
            ...(fetchMiddlewares<RequestHandler>(AppointmentController)),
            ...(fetchMiddlewares<RequestHandler>(AppointmentController.prototype.createSyncAppointment)),

            async function AppointmentController_createSyncAppointment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    request: {"in":"body","name":"request","required":true,"ref":"CreateSyncAppointmentRequest"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AppointmentController();

              await templateService.apiHandler({
                methodName: 'createSyncAppointment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ad_hoc/:orderId/details',
            ...(fetchMiddlewares<RequestHandler>(AdHocController)),
            ...(fetchMiddlewares<RequestHandler>(AdHocController.prototype.getAdHocOrderInstallment)),

            async function AdHocController_getAdHocOrderInstallment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    installmentId: {"in":"query","name":"installmentId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdHocController();

              await templateService.apiHandler({
                methodName: 'getAdHocOrderInstallment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/ad_hoc/:orderId/process',
            ...(fetchMiddlewares<RequestHandler>(AdHocController)),
            ...(fetchMiddlewares<RequestHandler>(AdHocController.prototype.processAdHocNexioPayment)),

            async function AdHocController_processAdHocNexioPayment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    installmentId: {"in":"query","name":"installmentId","required":true,"dataType":"string"},
                    nexioPaymentId: {"in":"query","name":"nexioPaymentId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdHocController();

              await templateService.apiHandler({
                methodName: 'processAdHocNexioPayment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/ad_hoc/:orderId/nexio-url',
            ...(fetchMiddlewares<RequestHandler>(AdHocController)),
            ...(fetchMiddlewares<RequestHandler>(AdHocController.prototype.getNexioAdHocPaymentUrl)),

            async function AdHocController_getNexioAdHocPaymentUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                    installmentId: {"in":"query","name":"installmentId","required":true,"dataType":"string"},
                    reset: {"default":false,"in":"query","name":"reset","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdHocController();

              await templateService.apiHandler({
                methodName: 'getNexioAdHocPaymentUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/admin/create-ad-hoc-order-installment',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.createAdHocOrderInstallment)),

            async function AdminController_createAdHocOrderInstallment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    email: {"in":"query","name":"email","required":true,"dataType":"string"},
                    amount: {"in":"query","name":"amount","required":true,"dataType":"double"},
                    productId: {"in":"query","name":"productId","required":true,"ref":"ProductId"},
                    key: {"in":"query","name":"key","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'createAdHocOrderInstallment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/generate-receipt',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.generateReceipt)),

            async function AdminController_generateReceipt(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    email: {"in":"query","name":"email","required":true,"dataType":"string"},
                    amount: {"in":"query","name":"amount","required":true,"dataType":"double"},
                    productId: {"in":"query","name":"productId","required":true,"ref":"ProductId"},
                    key: {"in":"query","name":"key","required":true,"dataType":"string"},
                    date: {"in":"query","name":"date","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'generateReceipt',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/upgrade-reassessment',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.upgradeOrder)),

            async function AdminController_upgradeOrder(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    key: {"in":"query","name":"key","required":true,"dataType":"string"},
                    email: {"in":"query","name":"email","required":true,"dataType":"string"},
                    medicationFrom: {"in":"query","name":"medicationFrom","required":true,"ref":"ReassessmentFromMedication"},
                    medicationTo: {"in":"query","name":"medicationTo","required":true,"ref":"ReassessmentToMedication"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'upgradeOrder',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/admin/recreate-reassessment',
            ...(fetchMiddlewares<RequestHandler>(AdminController)),
            ...(fetchMiddlewares<RequestHandler>(AdminController.prototype.recreateReassessment)),

            async function AdminController_recreateReassessment(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    key: {"in":"query","name":"key","required":true,"dataType":"string"},
                    email: {"in":"query","name":"email","required":true,"dataType":"string"},
                    medication: {"in":"query","name":"medication","required":true,"ref":"PrescriberyMedication"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AdminController();

              await templateService.apiHandler({
                methodName: 'recreateReassessment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
