GS.Controllers.BaseController.extend("GS.Controllers.VipInterface", {onDocument:false, vipErrorCodes:{"GS-00":"VIP_ERROR_UNKNOWN", "GS-01":"VIP_ERROR_LOGIN", "GS-02":"VIP_ERROR_ALREADY_VIP", "CC-01":"VIP_ERROR_MISSING_NAME", "CC-02":"VIP_ERROR_UNKNOWN", "CC-03":"VIP_ERROR_MISSING_CC_INFO", "CC-04":"VIP_ERROR_ADDRESS", "CC-05":"VIP_ERROR_UNKNOWN", "CC-06":"VIP_ERROR_PAYMENT_PROCESSOR", "CC-07":"VIP_ERROR_SESSION_EXPIRED", "CC-08":"VIP_ERROR_INVALID_CC", "CC-09":"VIP_ERROR_MISSING_CVD", "CC-10":"VIP_ERROR_INVALID_CVD",
    "CC-11":"VIP_ERROR_ADDRESS1_TOO_LONG", "CC-000":"VIP_ERROR_GENERIC_PAYMENT_ERROR", "CC-000X":"VIP_ERROR_GENERIC_PAYMENT_ERROR", "CC-000-1":"VIP_ERROR_XML", "CC-001":"VIP_ERROR_CARD_DECLINED", "PP-01":"VIP_ERROR_UNKNOWN", "PP-02":"VIP_ERROR_UNKNOWN_PAYPAL", "PP-03":"VIP_ERROR_UNKNOWN", "PP-04":"VIP_ERROR_PAYPAL_CANCEL", "PP-000":"VIP_ERROR_PAYPAL_FAIL", "PP-000X":"VIP_ERROR_PAYPAL_FAIL", "PPX-001":"VIP_ERROR_PAYPAL_COUNTRY", "PC-01":"VIP_ERROR_NO_PROMOCODE", "PC-02":"VIP_ERROR_CODE_NOT_FOUND", "PC-03":"VIP_ERROR_CODE_REDEEMED",
    "RC-01":"VIP_ERROR_NOT_ENOUGH_POINTS"}, excludedCreditCardCountries:{BY:true, MM:true, CD:true, CI:true, CU:true, RS:true, IR:true, IQ:true, LB:true, LR:true, LY:true, KP:true, RW:true, SD:true, SY:true, VE:true, ZW:true, EG:true, ID:true, NG:true, PH:true, UA:true}, excludedRecurringCountries:{AF:true, AL:true, AM:true, AO:true, AT:true, AZ:true, BA:true, BD:true, BE:true, BG:true, BI:true, BY:true, CD:true, CF:true, CG:true, CK:true, CS:true, CU:true, DE:true, DZ:true, EG:true, ER:true, ET:true, GE:true, GT:true, HT:true, ID:true, IQ:true, IR:true,
    KG:true, KH:true, KP:true, KZ:true, LA:true, LR:true, LY:true, MD:true, MK:true, MM:true, MN:true, MY:true, NG:true, NR:true, PH:true, PK:true, RO:true, RU:true, RW:true, SD:true, SL:true, SR:true, SY:true, TJ:true, TM:true, UZ:true, VE:true, YE:true, ZW:true}}, {vipPackageNames:{plus:"plus", anywhere:"anywhere", lite:"lite", vip:"vip"}, vipPackagePrices:GS.user.subscription.getNewPricing(), showVipErrors:function (c) {
    if (c.errorID && c.message)c.error = [
        {errorID:c.errorID, message:c.message}
    ];
    var a, b = ['<ul class="errors">'];
    this.element.find(".error.response .message").html("");
    this.element.find(".error.response").hide();
    if (c.error && c.error.length) {
        _.forEach(c.error, this.callback(function (d) {
            if (a = $.trim($.localize.getString(GS.Controllers.VipInterface.vipErrorCodes[d.errorID])))b.push("<li>" + a + "</li>"); else {
                console.warn("unknown error in arr", d.errorID, d.message, GS.Controllers.VipInterface.vipErrorCodes[d.errorID]);
                a = _.isString(d.message) ? d.message : d.message[0];
                if (a.match("AVS"))a = $.localize.getString("VIP_ERROR_AVS"); else if (a.match("invalid XML"))a = $.localize.getString("VIP_ERROR_XML");
                else if (a.match("invalid card number"))a = $.localize.getString("VIP_ERROR_CARD_NUMBER"); else if (a.match("CVD check"))a = $.localize.getString("VIP_ERROR_CVD");
                a && b.push("<li>" + a + "</li>")
            }
        }));
        b.push("</ul>");
        c = this.element.find(".error").show().find(".message");
        c.html("<strong>" + $.localize.getString("POPUP_VIP_ERROR_MESSAGE") + "</strong> " + b.join(""))
    } else {
        this.element.find(".message").attr("data-translate-text", "VIP_ERROR_UNKNOWN").html($.localize.getString("VIP_ERROR_UNKNOWN"));
        this.element.find(".error").show()
    }
},
    "a.login click":function () {
        GS.getLightbox().close();
        GS.getLightbox().open("login")
    }});

