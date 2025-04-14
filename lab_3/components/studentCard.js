import React, {useEffect, useState} from "https://esm.sh/react/?dev";
import ReactDOMClient from "https://esm.sh/react-dom/client/?dev";




const StudentCard = ({student}) => {

    return (
        <>
            <div className="card">
                <img src={student.photo} alt="Student" width="400px" height="400px"/ />
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        {Object.entries(student.notes).map(([key, value]) => {
                            if (value !== 0) {
                                return <li key={key}>{key}: {value}</li>;
                            }
                            return null;
                        })}
                    </ul>
                </div>
            </div>
        </>
    )

}

export default StudentCard;

