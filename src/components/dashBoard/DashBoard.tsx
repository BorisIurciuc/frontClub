import UserActivity from "../userActivity/UserActivity.tsx";
import Button from "../button/Button.tsx";
import {useNavigate} from "react-router-dom";

const DashBoard = () => {
    const navigate = useNavigate();
    const handleEditProfileClick = () => {
        navigate("/editProfile");
    }

    return (
        <div>
            <div>
                <p>Dash board</p>
            </div>
            <div>
                <Button name={"Edit profile"} onClick={handleEditProfileClick} />
            </div>
            <div>
                <UserActivity />
            </div>


        </div>
    );
};

export default DashBoard;
