"""
FitBot Calorie Burn Prediction using a PyTorch Neural Network

This script loads workout/fitness data from a CSV file and trains a feedforward neural network
to predict calories burned. The process includes:
1. Loading and preprocessing the dataset using a custom PyTorch Dataset class.
2. Defining a simple feedforward neural network architecture.
3. Training the model using mean squared error (MSE) loss.
4. Plotting the training loss curve using a symmetric log (symlog) scale for better visualization of trends.

Note: This script assumes the target column is 'caloriesBurnedCalculated'.
"""

import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import LabelEncoder, StandardScaler
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import LogLocator, NullFormatter

class FitBotDataset(Dataset):
    def __init__(self, csv_path):
        df = pd.read_csv(csv_path)

        drop_cols = ['timestamp', 'batchID', 'calorieError', 'user']
        for col in drop_cols:
            if col in df.columns:
                df = df.drop(columns=[col])

        for col in df.columns:
            if col != 'caloriesBurnedCalculated' and df[col].dtype == 'object':
                try:
                    df[col] = pd.to_numeric(df[col])
                except:
                    le = LabelEncoder()
                    df[col] = le.fit_transform(df[col].astype(str))

        df = df.fillna(0)

        self.y = df['caloriesBurnedCalculated'].values.astype('float32')
        self.X = df.drop(columns=['caloriesBurnedCalculated']).values.astype('float32')

        scaler = StandardScaler()
        self.X = scaler.fit_transform(self.X).astype('float32')

    def __len__(self):
        return len(self.y)

    def __getitem__(self, idx):
        return torch.tensor(self.X[idx]), torch.tensor(self.y[idx])

class CalorieModel(nn.Module):
    def __init__(self, input_dim):
        super(CalorieModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x.squeeze()

def train_one_epoch(model, dataloader, optimizer, loss_fn):
    model.train()
    total_loss = 0
    for inputs, targets in dataloader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = loss_fn(outputs, targets)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * inputs.size(0)
    return total_loss / len(dataloader.dataset)

def main():
    csv_path = "./calories_output.csv"

    dataset = FitBotDataset(csv_path)
    input_dim = dataset.X.shape[1]

    dataloader = DataLoader(dataset, batch_size=64, shuffle=True)

    model = CalorieModel(input_dim)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    loss_fn = nn.MSELoss()

    epochs = 50
    all_losses = []

    for epoch in range(epochs):
        train_loss = train_one_epoch(model, dataloader, optimizer, loss_fn)
        all_losses.append(train_loss)
        print(f"Epoch {epoch+1}/{epochs}, Loss: {train_loss:.6f}")

    # Plot with symlog scale y-axis (linear near zero, log elsewhere)
    plt.figure(figsize=(8,5))
    plt.plot(range(1, epochs + 1), all_losses, marker='o', color='b')
    plt.title("Loss Curve of MET Calorie Burned Estimation vs True Value")
    plt.xlabel("Epoch")
    plt.ylabel("MSE Loss (symlog scale)")
    
    plt.yscale('symlog', linthresh=1)  # linear between -1 and 1, log beyond
    
    # Set y ticks exactly at 0, 10, 100, 1000
    # plt.yticks([0, 10, 100, 1000], ['0', '10', '100', '1000'])
    plt.yscale('symlog', linthresh=1)
    # Use a log locator for positive ticks only, skipping very small values
    plt.gca().yaxis.set_major_locator(LogLocator(base=10, subs=(1.0,), numticks=10))
    plt.grid(True, which='both', axis='y', linestyle='--', linewidth=0.5)

    plt.xlim(1, epochs)
    # plt.grid(True, which='both', linestyle='--', linewidth=0.5)
    plt.show()

if __name__ == "__main__":
    main()
