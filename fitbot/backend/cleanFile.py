import pandas as pd
import random
from datetime import datetime, timedelta

# Load CSV
df = pd.read_csv('sample_workout_fitness.csv')

# Generate random timestamp for each row
def random_timestamp_2025():
    # Start and end of the year
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31, 23, 59, 59)
    
    # Random datetime between start and end
    delta = end_date - start_date
    random_seconds = random.randint(0, int(delta.total_seconds()))
    random_date = start_date + timedelta(seconds=random_seconds)
    
    # Format: 2025-05-31T05:00:00.000+00:00
    return random_date.strftime('%Y-%m-%dT%H:%M:%S.000+00:00')

# Apply timestamp to each row
df['timestamp'] = df.apply(lambda row: random_timestamp_2025(), axis=1)

# Save to new CSV
df.to_csv('modified_file.csv', index=False)
