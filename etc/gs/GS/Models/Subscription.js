(function (c) {
    var a = {canListen:1, noAds:2, mobile:4, playerBonuses:8, desktop:16, email:32}, b = {month:3, year:30}, d = {plus:{month:6, year:60}, anywhere:{month:9, year:90}, lite:{month:2, year:20}, liteEx:{month:4, year:40}};
    GS.Models.Base.extend("GS.Models.Subscription", {ID_LITE:21, ID_PLUS:6, ID_ANYWHERE:8, LENGTH_WEEK:2, LENGTH_MONTH:3, LENGTH_6_MONTH:7, LENGTH_YEAR:9, LENGTH_LIFETIME:11, standardizeType:function (f) {
        var g = {};
        f = parseInt(f, 10);
        switch (f) {
            case 1:
            case 3:
            case 4:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length =
                        GS.Models.Subscription.LENGTH_MONTH;
                g.special = true;
                break;
            case 2:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_YEAR;
                g.special = true;
                break;
            case 5:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_MONTH;
                g.special = true;
                break;
            case 6:
            case 15:
            case 20:
                g.type = GS.Models.Subscription.ID_PLUS;
                g.length = GS.Models.Subscription.LENGTH_MONTH;
                break;
            case 7:
            case 16:
            case 19:
                g.type = GS.Models.Subscription.ID_PLUS;
                g.length = GS.Models.Subscription.LENGTH_YEAR;
                break;
            case 8:
            case 10:
            case 11:
            case 13:
            case 14:
            case 17:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_MONTH;
                break;
            case 9:
            case 18:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_YEAR;
                break;
            case 12:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_WEEK;
                break;
            case 21:
                g.type = GS.Models.Subscription.ID_LITE;
                g.length = GS.Models.Subscription.LENGTH_MONTH;
                break;
            case 22:
                g.type = GS.Models.Subscription.ID_LITE;
                g.length =
                        GS.Models.Subscription.LENGTH_YEAR;
                break;
            case 97:
                g.type = GS.Models.Subscription.ID_LITE;
                g.length = GS.Models.Subscription.LENGTH_LIFETIME;
                break;
            case 98:
                g.type = GS.Models.Subscription.ID_PLUS;
                g.length = GS.Models.Subscription.LENGTH_LIFETIME;
                break;
            case 99:
                g.type = GS.Models.Subscription.ID_ANYWHERE;
                g.length = GS.Models.Subscription.LENGTH_LIFETIME;
                break
        }
        return g
    }, getSubscriptionFromDetails:function (f, g) {
        var k = f.bVip === 1 || f.bVip === "1";
        if ((f === false || !f.paymentType) && g && g.IsPremium)return GS.user.Flags & GS.Models.User.FLAG_ANYWHERE ?
                new GS.Models.Subscription({SubscriptionTypeID:99, vip:k, isLoaded:true}) : GS.user.Flags & GS.Models.User.FLAG_PLUS ? new GS.Models.Subscription({SubscriptionTypeID:98, vip:k, isLoaded:true}) : GS.user.Flags & GS.Models.User.FLAG_LITE ? new GS.Models.Subscription({SubscriptionTypeID:97, vip:k, isLoaded:true}) : new GS.Models.Subscription({SubscriptionTypeID:99, vip:k, isLoaded:true}); else if (!f || !f.bActive || f.bActive == "0")return new GS.Models.Subscription({SubscriptionTypeID:0, vip:k, isLoaded:true});
        k = {vip:k, isLoaded:true};
        k.SubscriptionTypeID = f.subscriptionTypeID;
        k.recurring = f.bRecurring;
        if (f.bVip === "1" || f.bVip === 1)if (g && g.IsPremium)k.type = GS.Models.Subscription.ID_ANYWHERE;
        k.paymentMethod = _.orEqual(f.paymentType, "UNKNOWN");
        k.billingAmount = parseFloat(f.amount).toFixed(2);
        if (f.dateUnsubscribed) {
            var m = f.dateUnsubscribed.split("-");
            if (m.length > 1)k.unsubscriptionDate = new Date(parseInt(m[0], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10))
        }
        if ((f.dateSubscriptionEnd || f.dateEnd || f.dateSubcriptionEnd) && !k.recurring)try {
            var h = _.orEqual(f.dateSubscriptionEnd,
                    f.dateSubcriptionEnd, f.dateEnd, "").split("-");
            if (h.length > 1)k.endDate = new Date(parseInt(h[0], 10), parseInt(h[1], 10) - 1, parseInt(h[2], 10))
        } catch (n) {
            k.endDate = -1
        } else if (k.unsubscriptionDate)k.endDate = k.unsubscriptionDate;
        if ((f.dateNextBill || f.dateNextCheck) && k.recurring && f.dateStart != f.dateNextCheck)try {
            var q = _.orEqual(f.dateNextBill, f.dateNextCheck, "").split("-");
            if (q.length > 1)k.nextBillDate = new Date(parseInt(q[0], 10), parseInt(q[1], 10) - 1, parseInt(q[2], 10))
        } catch (s) {
            k.nextBillDate = -1
        } else if (f.dateStart ==
                f.dateNextCheck)k.nextBillDate = k.endDate;
        if (f.period == "MONTH")k.length = GS.Models.Subscription.LENGTH_MONTH; else if (f.period == "YEAR")k.length = GS.Models.Subscription.LENGTH_YEAR; else if (f.period == "WEEK")k.length = GS.Models.Subscription.LENGTH_WEEK;
        if (g && (g.Flags & GS.Models.User.FLAG_ANYWHERE) > 0)k.type = GS.Models.Subscription.ID_ANYWHERE; else if (g && (g.Flags & GS.Models.User.FLAG_PLUS) > 0)k.type = GS.Models.Subscription.ID_PLUS; else if (g && (g.Flags & GS.Models.User.FLAG_LITE) > 0)k.type = GS.Models.Subscription.ID_LITE;
        return new GS.Models.Subscription(k)
    }, getFeatures:function (f) {
        switch (f) {
            case GS.Models.Subscription.ID_LITE:
                return a.canListen | a.email;
            case GS.Models.Subscription.ID_PLUS:
                return a.canListen | a.noAds | a.playerBonuses | a.desktop | a.email;
            case GS.Models.Subscription.ID_ANYWHERE:
                return a.canListen | a.noAds | a.mobile | a.playerBonuses | a.desktop | a.email
        }
        return 0
    }}, {SubscriptionTypeID:0, type:0, length:0, recurring:false, billingAmount:0, paymentMethod:null, endDate:null, nextBillDate:null, unsubscriptionDate:null, isLoaded:false,
        features:0, listenConst:0, vip:false, init:function (f) {
            this._super(f);
            f || (f = {});
            if (this.SubscriptionTypeID = _.orEqual(f.SubscriptionTypeID, 0)) {
                var g = GS.Models.Subscription.standardizeType(f.SubscriptionTypeID);
                f = c.extend({}, g, f)
            }
            this.type = _.orEqual(f.type, 0);
            this.length = _.orEqual(f.length, 0);
            this.billingAmount = _.orEqual(f.billingAmount, 0);
            this.recurring = _.orEqual(f.recurring, false);
            this.features = GS.Models.Subscription.getFeatures(this.type);
            this.endDate = _.orEqual(f.endDate, null);
            this.nextBillDate = _.orEqual(f.nextBillDate,
                    null);
            this.unsubscriptionDate = _.orEqual(f.unsubscriptionDate, null);
            this.paymentMethod = _.orEqual(f.paymentMethod, null);
            this.vip = _.orEqual(f.vip, false);
            this.isLoaded = f.isLoaded ? true : false
        }, isActive:function () {
            if (this.endDate && this.endDate < new Date)return false;
            return true
        }, getTypeName:function () {
            switch (this.type) {
                case GS.Models.Subscription.ID_LITE:
                    return"Grooveshark";
                case GS.Models.Subscription.ID_PLUS:
                    return c.localize.getString("GROOVESHARK_PLUS");
                case GS.Models.Subscription.ID_ANYWHERE:
                    return c.localize.getString("GROOVESHARK_ANYWHERE")
            }
            return""
        },
        getTypeString:function () {
            switch (this.type) {
                case GS.Models.Subscription.ID_LITE:
                    return"lite";
                case GS.Models.Subscription.ID_PLUS:
                    return"plus";
                case GS.Models.Subscription.ID_ANYWHERE:
                    return"anywhere"
            }
            return""
        }, hasSubscription:function () {
            return this.type > 0
        }, isPremium:function () {
            return!(this.type == GS.Models.Subscription.ID_LITE || this.type == 0)
        }, isPlus:function () {
            return this.type == GS.Models.Subscription.ID_PLUS
        }, isAnywhere:function () {
            return this.type == GS.Models.Subscription.ID_ANYWHERE
        }, isLite:function () {
            return this.type ==
                    GS.Models.Subscription.ID_LITE
        }, isSpecial:function () {
            return this.length == GS.Models.Subscription.LENGTH_LIFETIME
        }, canHideAds:function () {
            return(this.features & a.noAds) > 0
        }, canUsePlayerBonuses:function () {
            return this.isAnywhere() || this.isPlus()
        }, canListenUninterrupted:function () {
            return(this.features & a.canListen) > 0
        }, canDirectEmail:function () {
            return(this.features & a.email) > 0
        }, canUseDesktop:function () {
            return(this.features & a.desktop) > 0
        }, getNextBillDate:function () {
            if (this.nextBillDate > 0)return this.nextBillDate.format("F j, Y");
            return null
        }, getEndDate:function () {
            if (this.endDate > 0)return this.endDate.format("F j, Y");
            return null
        }, getNewPricing:function () {
            var f = c.extend({}, d);
            if (this.vip)f.anywhere = b;
            return f
        }, canUpgradeToLite:function () {
            return!(this.type > 0 || this.length == GS.Models.Subscription.LENGTH_LIFETIME || this.recurring || this.vip)
        }, canUpgradeToPlus:function () {
            return!(this.type > 0 || this.length == GS.Models.Subscription.LENGTH_LIFETIME || this.recurring || this.vip)
        }, canUpgradeToAnywhere:function () {
            return!(this.type > 0 || this.length ==
                    GS.Models.Subscription.LENGTH_LIFETIME || this.recurring)
        }, canExtend:function () {
            return!(this.length == GS.Models.Subscription.LENGTH_LIFETIME || this.recurring)
        }})
})(jQuery);

