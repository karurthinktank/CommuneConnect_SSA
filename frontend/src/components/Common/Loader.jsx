import '../../assets/scss/_loader.scss';
import loader1 from "../../assets/images/loader1.png";
import loader2 from "../../assets/images/loader2.png";
import loader3 from "../../assets/images/loader3.png";
import loader4 from "../../assets/images/small-logo/1-removebg-preview.png"; 
function Loader() {
    return (

        <div className="smartui-loader d-block">
            <div className="loader-container">
                <div className="donut loader-blue-bg-white">
                </div><div className="loaderWrap">
                    <div className=" loadtemple">
                        <img src={loader4} style={{width:"55px"}}></img>
                    </div>
                    
                </div></div></div>

    )
}
export default Loader;