import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dbData from './data/db.json';

// Styled Components
const Container = styled.div`
  min-height: 100svh;
  padding: 20px;
  background-color: #111827;
  color: #ffffff;
`;

const Header = styled.div`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Balance = styled.h1`
  font-size: 2.8rem;
  color: ${props => props.amount >= 0 ? '#10B981' : '#EF4444'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 80px;
`;

const Transaction = styled.div`
  background: rgba(31, 41, 55, 0.7);
  padding: 16px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 15px;
  align-items: center;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Description = styled.div`
  font-weight: 500;
`;

const DateText = styled.small`
  color: #9CA3AF;
`;

const Amount = styled.span`
  color: ${props => props.type === 'credit' ? '#10B981' : '#EF4444'};
  font-weight: bold;
  font-size: 1.1rem;
`;

const RunningBalance = styled.span`
  color: ${props => props.amount >= 0 ? '#10B981' : '#EF4444'};
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(145deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  padding: 25px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #10B981;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s;
  background: ${props => props.primary ? 'linear-gradient(145deg, #10B981 0%, #059669 100%)' : 
    props.danger ? 'linear-gradient(145deg, #EF4444 0%, #DC2626 100%)' : 
    'linear-gradient(145deg, #4B5563 0%, #374151 100%)'};
  color: white;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ResetButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: linear-gradient(145deg, #EF4444 0%, #DC2626 100%);
`;

function App() {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [transactionType, setTransactionType] = useState('credit');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    // Load initial data from db.json
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    try {
      const loadedTransactions = dbData.transactions.map(t => ({
        ...t,
        date: t.date || getCurrentDate()
      }));
      setTransactions(loadedTransactions);
      calculateBalance(loadedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const calculateBalance = (transactions) => {
    let runningBalance = 0;
    const updatedTransactions = transactions.map(transaction => {
      runningBalance += transaction.type === 'credit' ? transaction.amount : -transaction.amount;
      return { ...transaction, runningBalance };
    });
    setTransactions(updatedTransactions);
    setBalance(runningBalance);
    saveTransactions(updatedTransactions);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const [year, month, day] = dateString.split('-');
      return new Date(year, month - 1, day).toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const saveTransactions = (newTransactions) => {
    try {
      // Update the transactions in memory
      dbData.transactions = newTransactions;
      
      // In a development environment, you can see the updated data in the console
      console.log('Updated transactions:', dbData.transactions);
      
      // Note: In a real application, you might want to use localStorage as a backup
      localStorage.setItem('transactions_backup', JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
      // Restore from backup if available
      const backup = localStorage.getItem('transactions_backup');
      if (backup) {
        setTransactions(JSON.parse(backup));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now(),
      amount: parseFloat(amount),
      description,
      type: transactionType,
      date: date
    };

    let newTransactions;
    if (editingTransaction) {
      newTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? newTransaction : t
      );
    } else {
      newTransactions = [...transactions, newTransaction];
    }

    // Sort transactions by date
    newTransactions.sort((a, b) => {
      const dateA = new Date(a.date.split('-').join('/'));
      const dateB = new Date(b.date.split('-').join('/'));
      return dateA - dateB;
    });

    calculateBalance(newTransactions);

    // Reset form
    setAmount('');
    setDescription('');
    setDate(getCurrentDate());
    setTransactionType('credit');
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setDate(transaction.date);
    setTransactionType(transaction.type);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    calculateBalance(newTransactions);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all transactions?')) {
      setTransactions([]);
      setBalance(0);
      saveTransactions([]);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Transactions Register</h2>
        <Balance amount={balance}>
          ${balance.toFixed(2)}
        </Balance>
      </Header>

      <TransactionList>
        {transactions.map(transaction => (
          <Transaction key={transaction.id}>
            <TransactionInfo>
              <Description>{transaction.description}</Description>
              <DateText>{formatDate(transaction.date)}</DateText>
            </TransactionInfo>
            <Amount type={transaction.type}>
              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </Amount>
            <RunningBalance amount={transaction.runningBalance}>
              ${transaction.runningBalance.toFixed(2)}
            </RunningBalance>
            <div>
              <ActionButton onClick={() => handleEdit(transaction)}>✏️</ActionButton>
              <ActionButton onClick={() => handleDelete(transaction.id)}>🗑️</ActionButton>
            </div>
          </Transaction>
        ))}
      </TransactionList>

      <FloatingButton onClick={() => {
        setEditingTransaction(null);
        setAmount('');
        setDescription('');
        setDate(getCurrentDate());
        setTransactionType('credit');
        setShowModal(true);
      }}>
        +
      </FloatingButton>

      <ResetButton onClick={handleReset}>
        Reset All
      </ResetButton>

      <Modal show={showModal}>
        <ModalContent>
          <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <ButtonGroup>
              <Button
                type="button"
                primary={transactionType === 'credit'}
                onClick={() => setTransactionType('credit')}
              >
                Credit
              </Button>
              <Button
                type="button"
                primary={transactionType === 'debit'}
                onClick={() => setTransactionType('debit')}
              >
                Debit
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button type="submit" primary>
                {editingTransaction ? 'Save Changes' : 'Add'}
              </Button>
              <Button type="button" onClick={() => {
                setShowModal(false);
                setEditingTransaction(null);
              }}>
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default App;
