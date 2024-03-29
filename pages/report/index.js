import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";

import { BsArrowRight } from "react-icons/bs";

import classes from "./report.module.css";

import { ReportContext } from "../../context/report";
import { useRouter } from "next/router";
import { grade, checkAnswer } from "../../utils/grade";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import SEO from "../../components/SEO";

const ReportSummary = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { value } = useContext(ReportContext);
  const score = 0;
  const totalScore = value?.length;

  useEffect(() => {
    if (!value) router.replace("/");
  }, [value]);

  for (let val of value) {
    if (val.type == "multiple") {
      let flag = checkAnswer(val);
      if (flag) score++;
    } else {
      if (val.answer == val.correctAnswer) score++;
    }
  }

  const percent = score / totalScore;
  const { name, color } = grade(percent);

  const openHandler = () => {
    setOpenModal(true);
  };
  const closeHandler = () => {
    setOpenModal(false);
  };

  return (
    <SEO title="Report">
      <section className={classes.Container}>
        <SummaryCard show={openModal} clicked={closeHandler} data={value} />
        <header className={classes.Header}>
          <h1>Congratulations!!!</h1>
        </header>
        <div className={classes.Box}>
          <div className={classes.BoxInner}>
            <h2>Your Score</h2>
            <p className={classes.Score}>
              {score} / {totalScore}
            </p>
            <p style={{ color: `${color}` }} className={classes.Grade}>
              {name}
            </p>
          </div>
        </div>
        <div className={classes.Detail}>
          <button onClick={openHandler}>
            <span>View Detailed Report</span>
            <span>
              <BsArrowRight />
            </span>
          </button>
        </div>
        <div className={classes.RedirectBtn}>
          <Link href="/">Go to Homepage</Link>
        </div>
      </section>
    </SEO>
  );
};

export default ReportSummary;
