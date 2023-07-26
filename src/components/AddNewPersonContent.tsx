import React, { useEffect } from "react";
import { useState } from "react";
import { INewPerson as Props, useStore } from "../App";

const AddNewPersonContent: React.FC = () => {
  const { newPersonData, updateNewPerson } = useStore();

  return (
    <div className="add_new_person_container">
      <div className="child_container">
        <div className="title"> Name</div>
        <input type="text" name="name" value={newPersonData.name} onChange={updateNewPerson} />
      </div>
      <div className="child_container">
        <div className="title">Email</div>
        <input type="email" name="email" value={newPersonData.email} onChange={updateNewPerson} />
      </div>
      <div className="child_container">
        <div className="title">Gender</div>
        <select name="gender" value={newPersonData.gender} onChange={updateNewPerson}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div className="child_container">
        <div className="title">Phone Number</div>
        <input type="text" name="phone" value={newPersonData.phone} onChange={updateNewPerson} />
      </div>
      <div className="child_container">
        <div className="title">Adress (City)</div>
        <input type="text" name="city" value={newPersonData.city} onChange={updateNewPerson} />
      </div>
      <div className="child_container">
        <div className="title">Adress (Street)</div>
        <input type="text" name="street" value={newPersonData.street} onChange={updateNewPerson} />
      </div>
    </div>
  );
};
export default AddNewPersonContent;
