'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import './globals.css';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Container = styled.div`
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
  padding: 2rem;
  border-radius: 0 0 24px 24px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #9CA3AF;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`;

const Balance = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.amount >= 0 ? '#10B981' : '#EF4444'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ScrollableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: 100px;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Transaction = styled.div`
  background: rgba(31, 41, 55, 0.7);
  padding: 16px;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 15px;
  align-items: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Description = styled.div`
  font-weight: 500;
  font-size: 1.05rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const DateText = styled.small`
  color: #9CA3AF;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Amount = styled.span`
  color: ${props => props.type === 'credit' ? '#10B981' : '#EF4444'};
  font-weight: 600;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const RunningBalance = styled.span`
  color: ${props => props.amount >= 0 ? '#10B981' : '#EF4444'};
  font-weight: 500;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  border-radius: 8px;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(145deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(90deg);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  gap: 1rem;
  background-color: #111827;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #1f2937;
  border-radius: 50%;
  border-top-color: #10B981;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #9CA3AF;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  background-color: #111827;

  h2 {
    color: #EF4444;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    color: #9CA3AF;
    font-size: 1.1rem;
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

export default function Home() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setTransactions(data);
      calculateBalance(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load transactions');
      setLoading(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const transactionData = {
      amount: parseFloat(amount),
      description,
      type: transactionType,
      date
    };

    try {
      if (editingTransaction) {
        const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
      } else {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
      }

      // Refresh transactions
      await fetchTransactions();

      // Reset form
      setAmount('');
      setDescription('');
      setDate(getCurrentDate());
      setTransactionType('credit');
      setShowModal(false);
      setEditingTransaction(null);
    } catch (error) {
      setError('Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description);
    setDate(transaction.date);
    setTransactionType(transaction.type);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await fetchTransactions();
    } catch (error) {
      setError('Failed to delete transaction');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all transactions?')) {
      try {
        await Promise.all(transactions.map(t => handleDelete(t._id)));
        setTransactions([]);
        setBalance(0);
      } catch (error) {
        setError('Failed to reset transactions');
      }
    }
  };

  if (loading) {
    return (
      <LoaderContainer>
        <Spinner />
        <LoadingText>Loading transactions...</LoadingText>
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <h2>Balance</h2>
          <Balance amount={balance}>
            ₹{balance.toFixed(2)}
          </Balance>
        </Header>

        <ScrollableContainer>
          <TransactionList>
            {[...transactions].reverse().map(transaction => (
              <Transaction key={transaction._id}>
                <TransactionInfo>
                  <Description>{transaction.description}</Description>
                  <DateText>{new Date(transaction.date).toLocaleDateString()}</DateText>
                </TransactionInfo>
                <Amount type={transaction.type}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </Amount>
                {/* <RunningBalance amount={transaction.runningBalance}>
                  ₹{transaction.runningBalance.toFixed(2)}
                </RunningBalance> */}
                <div>
                  <ActionButton onClick={() => handleEdit(transaction)}>✏️</ActionButton>
                  <ActionButton onClick={() => handleDelete(transaction._id)}>🗑️</ActionButton>
                </div>
              </Transaction>
            ))}
          </TransactionList>
        </ScrollableContainer>

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
    </PageContainer>
  );
} 