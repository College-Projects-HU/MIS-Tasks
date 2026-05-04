# Cassandra Task

## 🧐 What is Apache Cassandra?
Cassandra is a **NoSQL Database**. 
- In a traditional database (like MySQL), data is stored in neat, connected tables. 
- In Cassandra, data is meant to be stored across hundreds of different servers globally (distributed). It is designed to handle **massive** amounts of data without ever crashing or going offline. 
- Because it’s spread across servers, it uses "Keys" to find data quickly:
  - **Partition Key**: Tells Cassandra *which server* holds your data.
  - **Clustering Key**: Tells Cassandra how to sort the data *inside* that server.
  - **Composite Primary Key**: Simply a primary key made of *both* of the above.

---

## How to Run Part 1 (Python Script)
Part 1 satisfies the task of creating the tables, adding 5 rows, updating a row, and deleting a row.

### Prerequisites (Assuming your environment is ready)
Make sure you have your virtual environment activated and the required driver installed:
```bash
# 1. Activate your virtual environment (If you aren't already using it)
source .venv/bin/activate

# 2. Install the Cassandra python package
pip install cassandra-driver

# 3. Run the python script!
python task.py
```
*Note: Make sure your local Cassandra server is actually running in the background before executing this.*

---

## How to Run Part 2 (Shell Commands)
Part 2 requires running commands in Cassandra's shell interface, known as **cqlsh** (Cassandra Query Language Shell). This language looks very much like normal SQL!

### Step-by-step
1. Open your terminal and type `cqlsh` to enter the Cassandra shell.
2. We stored our task commands in `commands.cql`. You have two options to run them:
   
   **Option A: Copy and paste them individually**
   Open the `commands.cql` file in an editor, read the comments, and copy-paste the SQL-looking commands directly into `cqlsh`.

   **Option B: Run the file automatically**
   From your normal bash terminal (not inside cqlsh), you can run:
   ```bash
   cqlsh -f commands.cql
   ```

### Explaining the Shell Commands

#### 1. Selecting rows in Descending Order:
```sql
SELECT * FROM laptop WHERE model = 'Pro' ORDER BY id DESC;
```
**Why do it this way?** In Cassandra, data can only be sorted depending on the *Partition Key*. That's why we had to specify `WHERE model = 'Pro'` first. Only then does Cassandra allow us to order vertically by our Clustering key `id`.

#### 2. Creating a Materialized View:
```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS laptop_by_name AS
    SELECT model, id, name, price, stock FROM laptop
    WHERE name IS NOT NULL AND model IS NOT NULL AND id IS NOT NULL
    PRIMARY KEY (name, model, id);
```
**Why do it this way?** Normally Cassandra strict rules mean: *You can only search using your Primary Keys.*
But what if we wanted to find out the price of the "Dell XPS 13"? We can't! Because `name` isn't a primary key. 
A **Materialized View** fixes this by essentially asking Cassandra to secretly create a *copy* of your table in the background, but rearranging the keys so `name` acts as the new shiny Primary Key. It updates itself automatically whenever the main `laptop` table is changed!


sudo pacman -Syu docker
sudo systemctl start docker
sudo systemctl enable docker


sudo docker run --name cassandra-local -p 9042:9042 -d cassandra:latest

sudo docker logs cassandra-local

sudo docker exec -it cassandra-local cqlsh

