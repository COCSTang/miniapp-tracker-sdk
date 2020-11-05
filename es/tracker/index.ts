import {logInfo } from "../utils/common"
import {getBasicInfo } from "../utils/alipay"
import {MTR} from "./mtr";
import CONFIG from "../config";
import {TrackerApi ,TrackerAppApi,TrackerPageApi,TrackerComponentApi} from "../interface"
import {TrackerData,API} from "../type"
import {Hook,TrackerPage,TrackerComponent,TrackerApp} from "./miniapp"
class TrackerClass implements TrackerApi {
  data:TrackerData
  Mtr:MTR
  App:TrackerAppApi
  Page:TrackerPageApi
  Component:TrackerComponentApi
  constructor(data:TrackerData){
    this.data = data
    this.Mtr = data.Mtr
    this.App = data.App
    this.Page = data.Page
    this.Component =  data.Component
  }
  log(seed:string,p?:any) {
    return this.Mtr.log(seed,p);
  }
  err(r:string, seed:string|any,p?:any) {
    return this.Mtr.err(r, seed,p);
  }
  click(seed:string, param?:any) {
    return this.Mtr.click(null, seed, param);
  }
  calc(seed:string, n:number, p4?:any) {
    return this.Mtr.calc(null,seed, n, p4);
  }
  expo(seed:string, dir?:string, param?:any) {
    return this.Mtr.expo(null, seed, dir, param);
  }
  setUserId(userId:string) {
    this.Mtr.setUserId(userId);    
  }
  getUserId():string{
    return  this.Mtr.getUserId()
   }
  api(data:API) {
    return this.Mtr.api(data); 
  }
}
function initMtr():TrackerClass {
  var Mtr = new MTR(CONFIG);
  Mtr.startTime = +Date.now(); 
  getBasicInfo(function (baseInfo:any) {
    Object.assign(Mtr, baseInfo);
    Mtr.baseInfo = baseInfo
    Mtr.start();
    Mtr.mtrDebug &&  logInfo("App init start");
  });
 
  my.canIUse("getRunScene") &&
    my.getRunScene({
      success: res => {       
        Mtr.mtrDebug &&  logInfo("getRunScene", res);        
        if(res.envVersion === "release") {
          Mtr.mtrDebug = false 
        }else {
          Mtr.workspaceId = res.envVersion
        }
      }
    });

  my.canIUse("isCollected") && my.isCollected({
    success: ({ isCollected }) => {
      //my.showToast({ content: '查询收藏成功',});
      Mtr.isCollected = isCollected;
      Mtr.mtrDebug &&  logInfo("isCollected " + isCollected);
    },
    fail: error => {
      //my.showToast({content: 'fail'+JSON.stringify(error) });
      Mtr.mtrDebug &&  logInfo("fail" + JSON.stringify(error));
    }
  })
  const tracker:TrackerData = {
    Mtr:Mtr,
    App: new TrackerApp(Mtr),
    Page:new TrackerPage(Mtr),
    Component:new TrackerComponent(Mtr),
  }

  return new TrackerClass(tracker)

}

const Tracker:TrackerClass = $global.Tracker || initMtr();


if (!$global.Tracker) {
  const _APP = App,
    _Page = Page,
    _Component = Component
    //Nn = {};
  App = function (app) {
    var Mtr:MTR = Tracker.Mtr;
    Object.assign(
      Mtr,
      app.mtrConfig || {
        appId: my.canIUse("getAppIdSync")  && my.getAppIdSync && my.getAppIdSync().appId,
        server: ["https://webtrack.allcitygo.com:8088/event/upload"],
        appName: "未配置",
        mtrDebug: false,
      }
    );
    Hook(app, "onLaunch", Tracker.App.onLaunch());
    Hook(app, "onShow", Tracker.App.onShow());
    Hook(app, "onHide", Tracker.App.onHide());
    Hook(app, "onError", Tracker.App.onError());
    app.Tracker = Tracker;
    return _APP(app);
  };
  Page = function (page:any) {
    let Mtr = Tracker.Mtr;
    if(!('onTap' in page)) {
      page.onTap = ()=>{}
    }
    if(!('onAppear' in page)) {
      page.onAppear = ()=>{}
    }
    Hook(page, "onLoad", Tracker.Page.onLoad());
    Hook(page, "onShow", Tracker.Page.onShow());
    Hook(page, "onHide", Tracker.Page.onHide());
    Hook(page, "onUnload", Tracker.Page.onUnload());
    if (Mtr.stat_auto_click) {
      Tracker.Page._hook(page);
    }
    page.$mtr_click = function (seed:string, param:any) {
      Mtr.click(page.route, seed, param);
    };
    page.$mtr_expo = function (seed:string, dir:string, param:any) {
      Mtr.expo(page.route, seed, dir, param);
    };
    page.$mtr_calc = function (r:string, n:number, p4:any) {
      Mtr.calc(page.route, r, n, p4);
    };

    return _Page(page);
  };

  Component = function (component) {
    Tracker.Component._hook(component);
    return _Component(component);
  };

  $global.Tracker = Tracker;
}
export default Tracker;
