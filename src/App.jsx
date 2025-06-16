import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  selectAllAccounts,
} from "../redux/reducers/accountSlice";
import {
  fetchTransactions,
  selectRecentTransactions,
} from "../redux/reducers/transactionSlice";
import {
  fetchBudgets,
  selectAllBudgets,
} from "../redux/reducers/budgetSlice";
import {
  fetchGoals,
  selectAllGoals,
} from "../redux/reducers/goalSlice";

import styles from "../src/assets/App.module.scss";

const App = () => {
  const dispatch = useDispatch();

  const accounts = useSelector(selectAllAccounts);
  const transactions = useSelector(selectRecentTransactions);
  const budgets = useSelector(selectAllBudgets);
  const goals = useSelector(selectAllGoals);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
    dispatch(fetchGoals());
  }, [dispatch]);

  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  return (
    <div>
      <div className={styles.head2}>
        <h3>Welcome to Your Dashboard</h3>
        <h5>Total Balance: {totalBalance.toFixed(2)} ₼</h5>
      </div>

      {/* Accounts */}
      <section>
        <h4>Accounts</h4>
        <div className={styles.grid}>
          {accounts.map((account) => (
            <div key={account._id} className={styles.card}>
              <h5>{account.name}</h5>
              <p>{account.type}</p>
              <p>{account.balance.toFixed(2)} ₼</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h4>Recent Transactions</h4>
        <div className={styles.grid}>
          {transactions.map((t) => (
            <div key={t._id} className={`${styles.card} ${styles[t.type]}`}>
              <h5>{t.description}</h5>
              <p>{new Date(t.date).toLocaleDateString("az-AZ")}</p>
              <strong>
                {t.type === "income" ? "+" : "-"}
                {t.amount.toFixed(2)} ₼
              </strong>
            </div>
          ))}
        </div>
      </section>

      {/* Budgets */}
      <section>
        <h4>Budgets</h4>
        <div className={styles.grid}>
          {budgets.map((b) => {
            const percent = ((b.spent || 0) / b.amount) * 100;
            return (
              <div key={b._id} className={styles.card}>
                <h5>{b.category}</h5>
                <div className={styles.progress}>
                  <div className={styles.fill} style={{ width: `${percent}%` }} />
                </div>
                <p>
                  {(b.spent || 0).toFixed(2)} / {b.amount.toFixed(2)} ₼
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Goals */}
      <section>
        <h4>Goals</h4>
        <div className={styles.grid}>
          {goals.map((g) => {
            const percent = ((g.currentAmount || 0) / g.targetAmount) * 100;
            return (
              <div key={g._id} className={styles.card}>
                <h5>{g.title}</h5>
                <div className={styles.progress}>
                  <div className={styles.fill} style={{ width: `${percent}%` }} />
                </div>
                <p>
                  {(g.currentAmount || 0).toFixed(2)} / {g.targetAmount.toFixed(2)} ₼
                </p>
                <small>
                  Deadline: {new Date(g.deadline).toLocaleDateString("az-AZ")}
                </small>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default App;
