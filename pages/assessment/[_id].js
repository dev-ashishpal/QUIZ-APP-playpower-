import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { BsFillInfoCircleFill, BsList, BsXLg } from "react-icons/bs";

import classes from "./assessment.module.css";

import { ReportContext } from "../../context/report";
import { removeItem } from "../../utils/grade";
import Question from "../../components/Question/Question";


import { quiz } from "../../external";
import SEO from "../../components/SEO";

const Assessment = () => {
  // Declaring and Initializing Variables.
  const { setValue } = useContext(ReportContext);
  const router = useRouter();
  const assessmentId = router.query._id;
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState(null);
  const [testName, setTestName] = useState(null);
  const noOfQuestion = status ? status.length : 0;

  // Creating REF to manipulate DOM on small screen devices.
  const layoutRef = useRef();
  const layoutRightRef = useRef();
  const layoutLeftRef = useRef();

  useEffect(() => {
    const response = quiz[assessmentId].data;
    setStatus([...response]);
    setTestName(quiz[assessmentId].name);
  }, []);

  // Function to toggle DOM Layout on small Screen devices.
  const toggleLayout = () => {
    layoutRef.current.classList.toggle(classes.ContainerToggle);
    layoutRightRef.current.classList.toggle(classes.InfoToggle);
    layoutLeftRef.current.classList.toggle(classes.QuestionsToggle);
  };

  // Function for checking visited question.
  const visitedHandler = (x) => {
    const updatedStatus = [...status];
    const singleStatus = { ...updatedStatus[x] };
    singleStatus.visited = true;
    updatedStatus[x] = singleStatus;
    setStatus(updatedStatus);
  };

  // Function for going back to prev question.
  const prevQues = () => {
    if (counter > 0) setCounter(--counter);
    visitedHandler(counter);
  };

  // Function for going to the next question.
  const nextQues = () => {
    if (counter < noOfQuestion - 1) setCounter(++counter);
    visitedHandler(counter);
  };

  // Function to direct to any particular question.
  const setQues = (val) => {
    setCounter(val - 1);
    visitedHandler(val - 1);
  };

  // Function to record the user input and store it inside a state.
  const inputChangeHandler = (e) => {
    const { value } = e.target;
    const updatedStatus = [...status];
    const singleStatus = { ...updatedStatus[counter] };

    if (singleStatus.type == "multiple") {
      if (singleStatus.answer.includes(value))
        removeItem(singleStatus.answer, value);
      else singleStatus.answer.push(value);
    } else singleStatus.answer = value;

    updatedStatus[counter] = singleStatus;
    setStatus(updatedStatus);
  };

  // Function to clear the selected answer.
  const clearSelection = () => {
    const updatedStatus = [...status];
    const singleStatus = { ...updatedStatus[counter] };

    singleStatus.answer = "";
    updatedStatus[counter] = singleStatus;
    setStatus(updatedStatus);
  };

  // Function to store user result in Context on submitting.
  const onSubmit = () => {
    console.log(status);
    setValue(status);
  };

  // declaring NEXT button
  let button = (
    <button onClick={nextQues} className={classes.Btn}>
      Next
    </button>
  );

  // Declaring SUBMIT button, when user's at last question.
  if (counter == noOfQuestion - 1) {
    button = (
      <Link href="/report">
        <button onClick={onSubmit} className={classes.SubmitBtn}>
          Submit
        </button>
      </Link>
    );
  }

  return (
    <SEO title="Assessment">
      <div className={classes.Container} ref={layoutRef}>
        <section className={classes.Questions} ref={layoutLeftRef}>
          <div className={classes.Toggle} onClick={toggleLayout}>
            <BsList />
          </div>

          <header className={classes.QuestionsBox}>
            <h1>
              <span>
                <BsFillInfoCircleFill />
              </span>
              <span>
                Question No. {status && status[counter].ques} of {noOfQuestion}
              </span>
            </h1>
            {/* <div className={classes.Timer}>
              <div className={classes.TimerInner}>00</div>
              <div className={classes.TimerInner}>04</div>
              <div className={classes.TimerInner}>28</div>
            </div> */}
          </header>
          <div className={classes.QuestionLayout}>
            {status ? (
              <Question data={status[counter]} onChange={inputChangeHandler} />
            ) : null}
          </div>
          <button onClick={clearSelection} className={classes.Clear}>
            Clear Selection
          </button>
          <div className={classes.ButtonContainer}>
            <button onClick={prevQues} className={classes.Btn}>
              Prev
            </button>
            {button}
          </div>
        </section>
        <section className={classes.Info} ref={layoutRightRef}>
          <div className={classes.Toggle} onClick={toggleLayout}>
            <BsXLg />
          </div>
          <div className={classes.Name}>{testName}</div>
          <header>
            <h2>Data Log</h2>
          </header>
          <div className={classes.PrevBox}>
            {status
              ? status.map((dt) => {
                  const color = [classes.PrevBoxGrey];
                  if (dt.visited && dt.answer) {
                    color.pop(classes.PrevBoxGrey);
                    color.pop(classes.PrevBoxYellow);
                    color.push(classes.PrevBoxGreen);
                  } else if (dt.visited) {
                    color.pop(classes.PrevBoxGrey);
                    color.pop(classes.PrevBoxGreen);
                    color.push(classes.PrevBoxYellow);
                  }
                  return (
                    <div
                      className={color.join(" ")}
                      key={dt.ques}
                      onClick={() => {
                        setQues(dt.ques);
                      }}
                    >
                      <span>{dt.ques}</span>
                    </div>
                  );
                })
              : null}
          </div>
        </section>
      </div>
    </SEO>
  );
};

export default Assessment;
