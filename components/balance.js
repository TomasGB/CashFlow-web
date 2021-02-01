import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import styles from "../styles/TransactionList.module.css";
import initFirebase from "../services/firebase";
function Balance() {
    initFirebase();
    let currentUserUID = firebase.auth().currentUser.uid;

    const [balance, setBalance] = useState(0);
    const [totIncome, setTotIncome] = useState(0);
    const [totExpense, setTotExpense] = useState(0);

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(`${currentUserUID}`)
            .collection("transactionsList")
            .orderBy("dateId", "desc")
            .onSnapshot((querySnapshot) => {
                let acumIncome = 0;
                let acumExpenses = 0;
                querySnapshot.docs.forEach((doc) => {
                    if (
                        (doc.data().Type == "expense") |
                        (doc.data().Type == "Expense")
                    ) {
                        acumExpenses =
                            acumExpenses + parseFloat(doc.data().Amount);
                    } else {
                        acumIncome = acumIncome + parseFloat(doc.data().Amount);
                    }
                    let finalBal = acumIncome - acumExpenses;

                    setBalance(finalBal);
                });

                setTotIncome(acumIncome);
                setTotExpense(acumExpenses);
            });
    }, []);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignSelf: "center",
                padding: 15,
            }}>
            <div
                style={{
                    justifyContent: "center",
                    marginTop: 5,
                    marginBottom: 5,
                    color: "#000",
                }}>
                <div>
                    <b
                        style={{
                            display: "block",
                            textAlign: "center",
                            justifyContent: "center",
                            fontSize: 24,
                        }}>
                        Your Balance
                    </b>
                    <h5 style={{ display: "block", textAlign: "center" }}>
                        {balance}
                    </h5>
                </div>
            </div>
            <div
                style={{
                    marginTop: 20,
                    marginBottom: 20,
                    display: "inline-flex",
                    alignSelf: "center",
                }}>
                <div
                    style={{
                        display: "inline-block",
                        alignSelf: "center",
                        textAlign: "center",
                    }}>
                    <div
                        style={{
                            fontSize: 16,
                            marginLeft: 15,
                            marginRight: 15,
                            color: "grey",
                        }}>
                        Income
                    </div>
                    <div
                        style={{
                            fontSize: 14,
                            color: "green",
                        }}>{`+ ${totIncome}`}</div>
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 16,
                            marginLeft: 15,
                            marginRight: 15,
                            color: "grey",
                        }}>
                        Expenses
                    </div>
                    <div
                        style={{
                            fontSize: 14,
                            color: "red",
                            alignSelf: "center",
                            textAlign: "center",
                        }}>{`+ ${totExpense}`}</div>
                </div>
            </div>
        </div>
    );
}
export default Balance;