import CoTop from "./Top/Top";
import CoSoLuoc from "./SoLuoc/SoLuoc";
import CoSuMenh1 from "./SuMenh1/SuMenh1";
import CoSuMenh2 from "./SuMenh2/SuMenh2";
import CoCauChuyen from "./CauChuyen/CauChuyen";
import CoDonate from "./Donate/Donate";
import Footer from "../../component/Footer/Footer";
import ButtonMini from "../../component/ButtonMini/ButtonMini";
import { useEffect } from "react";

function Quy() {

  return (
    <div>
      <CoTop />
      <CoSoLuoc />
      <CoSuMenh1 />
      <CoSuMenh2 />
      {/* <CoCauChuyen /> */}
      <CoDonate />

      <ButtonMini />
      <Footer />
    </div>
  );
}

export default Quy;
