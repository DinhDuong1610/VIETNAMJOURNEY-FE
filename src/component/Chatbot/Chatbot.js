import { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    if (!window.kommunicate) {
      (function (d, m) {
        var onInitRan = false;

        var kommunicateSettings = {
          appId: "e76b18426ebf68b6f1407f321791adba",
          popupWidget: true,
          automaticChatOpenOnNavigation: true,

        //   onInit: function(){
        //     if (!onInitRan) {
        //        Kommunicate.displayKommunicateWidget(false);
        //        onInitRan = true
        //     }
        //     document.getElementById("button").disabled=false;
        // }
        };
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0];
        h.appendChild(s);
        window.kommunicate = m;
        m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
    }
  }, []);

  return <div></div>;
}

export default Chatbot;
