import "../styles/homeforcreators.scss";
import addonImage1 from "../assets/for-creators-images/addon_image1.webp";
import addonImage2 from "../assets/for-creators-images/addon_image2.webp";
import addonImage3 from "../assets/for-creators-images/addon_image3.webp";
import addonImage4 from "../assets/for-creators-images/addon_image4.webp";
import addonImage5 from "../assets/for-creators-images/addon_image5.webp";
import addonImage6 from "../assets/for-creators-images/addon_image6.webp";

function HomeForCreators() {
    return (
        <div className="for-creators">
        
            <div className="for-creators-textbox">
                <h1 className="for-creators-header">For Creators</h1>
                <h2 className="for-creators-dsc">You can't find your addon here?</h2>
                <h2 className="for-creators-dsc">Contact us and request a re-scan of all addons for your addon to join other!</h2>
                <h2 className="for-creators-dsc-extended">You can join our Discord or email us on: blueprint-site@proton.me</h2>
                <a href="https://discord.gg/ZF7bwgatrT" className="for-creators-discord">Join our Discord!</a>
                <a href="mailto:blueprint-site@proton.me" className="for-creators-email">Email us</a>
            </div>
        
            <div className="for-creators-imagebox">
                <img src={ addonImage1 } alt="" className="for-creators-image"/>
                <img src={ addonImage2} alt="" className="for-creators-image"/>
                <img src={ addonImage3 } alt="" className="for-creators-image"/>
                <img src={ addonImage4 } alt="" className="for-creators-image"/>
                <img src={ addonImage5 } alt="" className="for-creators-image"/>
                <img src={ addonImage6 } alt="" className="for-creators-image"/>
            </div>
            
	    </div>
    );
};

export default HomeForCreators;