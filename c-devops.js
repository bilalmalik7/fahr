// DevOps line.
(function(){
const {py,sql,yaml,sh,txt,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;

WD.annot.yaml={l:'yaml',title:'A pipeline file, line by line',lines:[
 ['trigger:','When does the pipeline start? This block answers it.'],
 ['  branches:\n    include: [ main ]','Start when somebody pushes to the branch main. Indentation (two spaces) shows what belongs to what. Never use tabs in YAML.'],
 ['variables:\n  pythonVersion: "3.11"','A named value you can use below as $(pythonVersion). Change it in one place.'],
 ['pool:\n  vmImage: ubuntu-latest','Which machine runs the work. Here: a fresh Linux machine that Microsoft provides. It is thrown away after the run.'],
 ['stages:','The big phases. They run one after another.'],
 ['- stage: Build\n  jobs:\n  - job: Validate','A stage contains jobs. A job is a list of steps on one machine. The dash starts a list element.'],
 ['    steps:\n    - checkout: self','Steps are single commands. This one downloads your repository onto the machine.'],
 ['    - script: pip install -r requirements.txt\n      displayName: Install packages','Run a command line. displayName is the title you see in the log.'],
 ['    - script: pytest tests/ --junitxml=results.xml\n      displayName: Run tests','Run the tests. If a test fails, the command returns an error, the step fails, and the pipeline stops.'],
 ['- stage: DeployTest\n  dependsOn: Build','This stage waits for Build and only starts when Build succeeded.'],
 ['  jobs:\n  - deployment: Deploy\n    environment: test','A deployment job targets an environment. On the environment you can set approvals: a person must click Approve before the job runs.']]};

TRACKS.devops={c:'o',letter:'O',name:'Azure DevOps and CI/CD',goal:'Work like a team: versions, reviews and safe releases',
intro:'DevOps means: every change is saved, checked and delivered in the same safe way. Data engineers are expected to know this. In the age of AI it matters even more, because code is written faster than it can be checked by hand.',
stations:[
{id:'O1',sec:'Git',min:30,t:'Git in plain words',sum:'Save points for your work. Try it in the simulator',
 body:`<p><b>Git</b> saves the history of your files. Each save point is a <b>commit</b>. A commit has a message, an author and a time. You can always go back to any commit.</p>
 <p>A <b>repository</b> (repo) is a project folder with its full history. There is one copy on a server (Azure DevOps or GitHub) and one copy on every developer's computer.</p>
 <p>A <b>branch</b> is your own line of work. You start it from <b>main</b>, the official version. You change things without breaking main. When you finish, you open a <b>pull request</b>. A colleague reads your change, and then it is <b>merged</b> into main.</p>
 ${W('gitgraph')}
 <h4>The words</h4>
 ${tbl(['Word','Meaning'],[
  ['<b>clone</b>','Download a repository with its history'],
  ['<b>add</b>','Choose which changed files go into the next commit (the "staging area")'],
  ['<b>commit</b>','Make a save point on your computer'],
  ['<b>push</b>','Send your commits to the server'],
  ['<b>pull</b>','Get the commits of others from the server'],
  ['<b>branch / switch</b>','Create a line of work / change to it'],
  ['<b>merge</b>','Join one branch into another'],
  ['<b>pull request</b> (PR)','Ask the team to review and merge your branch']])}
 <h4>A good commit message</h4>
 <p>Say <b>what</b> and <b>why</b> in one short line. Bad: "fix". Good: "Fix hatch rate: exclude settings with 0 eggs". In six months you will read these lines to find out when something changed.</p>`,
 know:'Without Git you have files like load_v2_final_NEW.sql. Git is the tidy version of that habit: one file, full history, and you can see who changed which line.',
 key:['Commit = save point. Branch = own line of work. Pull request = review before merge.','Main always works. Nothing goes in without review.'],
 do:['Use the simulator above: make two commits, create a branch, commit there, merge.','Install Git and VS Code. Create a folder, run <code>git init</code>, add a file, commit.','Create a branch, change the file, commit, switch back to main and merge.'],
 links:[['Learn Git Branching (interactive)','https://learngitbranching.js.org/'],['Pro Git book (free)','https://git-scm.com/book/en/v2']],
 ex:[
 {t:'order',q:'Put the normal team workflow in order.',items:['Create a branch','Change the files','Commit','Push','Open a pull request','Colleague reviews','Merge into main'],w:'Nothing goes into main without a review.'},
 {t:'mcq',q:'Why do you work on a branch?',o:['It is faster','To keep the main version safe while you work','Git needs it to start'],a:1,w:'Main always stays in a working state.'},
 {t:'mcq',q:'What is the difference between commit and push?',o:['Commit saves on your computer. Push sends the commits to the server','No difference','Push saves, commit sends'],a:0,w:'You can commit many times without network, then push once.'},
 {t:'mcq',q:'Which commit message is best?',o:['changes','Fix watermark: use modified_at, not created_at','asdf'],a:1,w:'What and why, short.'}]},

{id:'O5',min:30,t:'Git every day: commands and conflicts',sum:'The ten commands you really use',
 body:`${sh`git clone https://dev.azure.com/org/project/_git/hatchery    # get the repo
git switch -c feature/add-quarantine      # new branch, and change to it
git status                                # what did I change?
git diff                                  # show the changed lines
git add notebooks/load_silver.py          # choose files for the commit
git commit -m "Add quarantine table for impossible hatch counts"
git push -u origin feature/add-quarantine # send the branch to the server
git pull                                  # get the newest commits
git log --oneline                         # short history
git restore notebooks/load_silver.py      # throw away my changes in this file`}
 <h4>Merge conflicts</h4>
 <p>You and a colleague changed the <b>same lines</b> of the same file. Git cannot know which version is right. It stops and marks the place:</p>
 ${txt`<<<<<<< HEAD
df = df.filter(col("eggs_set") > 0)
=======
df = df.filter(col("eggs_set") >= 100)
>>>>>>> feature/min-eggs`}
 <p>The part above <code>=======</code> is your branch. The part below is the other one. You edit the file so that it is right, delete the three marker lines, then <code>git add</code> and <code>git commit</code>. Often you talk to the colleague first. A conflict is not an error. It is Git asking a question.</p>
 ${tip('Conflicts stay small when branches are short-lived. Merge small changes often. A branch that lives three weeks will hurt.')}
 <h4>Undo safely</h4>
 ${tbl(['Situation','Command'],[
  ['I changed a file and want the old version back','<code>git restore file</code>'],
  ['A commit that is already on the server was wrong','<code>git revert &lt;commit&gt;</code> makes a new commit that undoes it. History stays honest'],
  ['I want to put work aside for a moment','<code>git stash</code>, later <code>git stash pop</code>']])}
 ${warn('Do not use <code>git push --force</code> on a shared branch and do not rewrite history that others already have. On your own feature branch it is your decision.')}
 <h4>What must never be in Git</h4>
 <ul><li><b>Passwords, keys, connection strings.</b> Once pushed, they are in the history for ever. Use a key vault.</li>
 <li><b>Data files</b> and big binaries.</li>
 <li>Put such paths into the file <code>.gitignore</code>, then Git does not see them.</li></ul>
 <h4>Branching strategies</h4>
 <p>Most data teams use <b>trunk-based development</b>: main is always deployable, feature branches live a few days, every merge goes through a pull request. Older and heavier is <b>Git flow</b> with long develop and release branches. If a team asks you, recommend the simple one.</p>`,
 key:['A conflict = two changes to the same lines. You decide, then add and commit.','revert undoes a shared commit safely.','No secrets and no data in Git.'],
 do:['Create a conflict on purpose: change the same line on two branches, merge, resolve it.','Add a <code>.gitignore</code> with <code>*.csv</code> and check that Git ignores your data files.'],
 links:[['Git cheat sheet','https://education.github.com/git-cheat-sheet-education.pdf']],
 ex:[
 {t:'mcq',q:'What is a merge conflict?',o:['Two branches changed the same lines, and Git needs you to decide','The server is down','A wrong password'],a:0,w:'Edit the file, remove the markers, add, commit.'},
 {t:'mcq',q:'A bad commit is already on main and others have pulled it. What is the safe way to undo it?',o:['git revert','git push --force','Delete the repository'],a:0,w:'revert adds a new commit that undoes the change.'},
 {t:'fill',q:'The file that tells Git which files to ignore is called .___',a:['gitignore'],w:'Put data files, secrets and temporary files there.'},
 {t:'mcq',q:'You accidentally committed a database password and pushed it. What must you do first?',o:['Change the password. It must be treated as leaked','Delete the line in a new commit and forget it','Nothing'],a:0,w:'The old commit still contains it. Rotate the secret, then clean up.'},
 {t:'order',q:'Order the commands for a first change.',items:['git clone','git switch -c feature/x','git add','git commit','git push'],w:'Get the repo, branch, stage, save, send.'}]},

{id:'O2',sec:'Azure DevOps',min:25,t:'What is inside Azure DevOps',sum:'Boards, Repos, Pipelines',
 body:`<p>Azure DevOps is a set of tools for a team. You get them all in one <b>project</b>.</p>
 ${tbl(['Part','What it is for'],[
  ['<b>Boards</b>','Plan the work. Tasks, bugs and user stories are <b>work items</b>. A board shows them in columns: To do, Doing, Done'],
  ['<b>Repos</b>','Git repositories for the code, with pull requests and branch rules'],
  ['<b>Pipelines</b>','Automatic build, test and release'],
  ['<b>Test Plans</b>','Manual and planned tests'],
  ['<b>Artifacts</b>','A store for packages your team builds']])}
 <h4>How teams plan: a small dictionary</h4>
 <ul><li><b>User story</b>: one need from the view of a user. "As a production manager I want to see the hatch rate per machine, so that I find bad machines early."</li>
 <li><b>Acceptance criteria</b>: the list that says when the story is done. "Numbers match the ERP report for October."</li>
 <li><b>Sprint</b>: a fixed time, often two weeks, in which the team finishes a set of stories.</li>
 <li><b>Backlog</b>: the ordered list of everything that is not started yet.</li></ul>
 <h4>Branch policies protect main</h4>
 <p>On the main branch you set rules: nobody pushes directly, every change needs a pull request, at least one reviewer must approve, the build pipeline must be green, and the pull request must be linked to a work item. Then the history answers three questions for every change: who, what and why.</p>
 <h4>What a good review looks at</h4>
 <ol><li>Does it do what the work item asks?</li><li>Can it run twice without harm (idempotent)?</li><li>What happens with empty input, nulls, duplicates?</li><li>Are there secrets in the code?</li><li>Is there a test or at least a row count check?</li></ol>
 ${job('When AI writes code for you, the review is your main job. Read every line as if a new colleague wrote it: polite, but trust nothing you did not understand.')}`,
 key:['Boards plan, Repos store, Pipelines automate.','Branch policy on main: pull request, reviewer, green build, linked work item.'],
 do:['Create a free Azure DevOps organisation and a project.','Create three work items for your hatchery project.','Push your project files to Repos.','Set a branch policy on main that requires one reviewer.'],
 links:[['Azure DevOps documentation','https://learn.microsoft.com/en-us/azure/devops/']],
 ex:[
 {t:'mcq',q:'Where do you record a bug so the team can plan it?',o:['Boards','Artifacts','Pipelines'],a:0,w:'Boards holds work items.'},
 {t:'mcq',q:'Where does the automatic release run?',o:['Repos','Pipelines','Boards'],a:1,w:'Pipelines build, test and deploy.'},
 {t:'mcq',q:'What stops a developer from pushing untested code directly to main?',o:['A branch policy','A sprint','A work item'],a:0,w:'Policies require a pull request, reviewers and a green build.'},
 {t:'mcq',q:'What are acceptance criteria?',o:['The conditions that say when a story is done','The salary of the tester','A type of branch'],a:0,w:'Agree on them before the work starts.'}]},

{id:'O3',min:35,t:'CI/CD pipelines',sum:'Run the simulator, then read the YAML',
 body:`<p><b>CI</b> (continuous integration): every change is built and tested automatically. <b>CD</b> (continuous delivery): a tested change moves to Dev, then Test, then Production in the same way every time.</p>
 <p>If one step fails, the pipeline stops and Production stays safe. Try it:</p>
 ${W('cicd')}
 <p>A pipeline is written in a <b>YAML</b> file that lives in the repository next to the code. So the pipeline has history and reviews too. Click each part:</p>
 ${W('annot','yaml')}
 <p>Remember the levels: a <b>pipeline</b> has <b>stages</b>, a stage has <b>jobs</b>, a job has <b>steps</b>.</p>
 <h4>What a data team puts into CI</h4>
 <ul><li><b>Lint</b>: an automatic check of code style and simple mistakes.</li>
 <li><b>Unit tests</b>: small tests of single functions.</li>
 <li><b>Build</b>: for a database project, build the dacpac. If a view refers to a missing column, the build fails before anything is deployed.</li>
 <li><b>Deploy to Dev or Test</b>, run the load on a small data set, and compare row counts.</li></ul>`,
 know:'Today a release may be a checklist in a document: "run script 1, then script 2, then deploy package". CI/CD turns the checklist into a program that never forgets a step.',
 key:['CI = build and test every change. CD = deliver the same way every time.','Pipeline → stages → jobs → steps.','A failed step stops everything before Production.'],
 do:['Create a pipeline in Azure DevOps from the starter template.','Add one script step that prints a message.','Make it fail on purpose (<code>exit 1</code>) and read the log.'],
 links:[['Azure Pipelines documentation','https://learn.microsoft.com/en-us/azure/devops/pipelines/']],
 ex:[
 {t:'fill',q:'In the YAML file, the ___ section says which branch starts the pipeline.',a:['trigger'],w:'trigger = when to run.'},
 {t:'order',q:'Order from biggest to smallest.',items:['Pipeline','Stage','Job','Step'],w:'A pipeline has stages, a stage has jobs, a job has steps.'},
 {t:'mcq',q:'The tests fail in the Build stage. What happens to Production?',o:['It gets the broken code','Nothing. The pipeline stops before deploying','It is deleted'],a:1,w:'That is the whole point of CI/CD.'},
 {t:'mcq',q:'Why is the pipeline definition stored as a YAML file in the repository?',o:['So that changes to the pipeline have history and review, like code','Because YAML is faster','It is not allowed anywhere else'],a:0,w:'"Pipeline as code".'},
 {t:'mcq',q:'What does "dependsOn: Build" on a stage mean?',o:['The stage runs only after Build has succeeded','The stage builds the code again','The stage is optional'],a:0,w:'It sets the order and the condition.'}]},

{id:'O6',min:30,t:'Variables, secrets, approvals',sum:'What makes a pipeline safe for production',
 body:`<h4>Variables</h4>
 <p>A value that differs per stage (server name, workspace name) should not be written into the steps. Put it into a <b>variable</b>, and group variables in a <b>variable group</b>. You read a variable as <code>$(name)</code>.</p>
 <h4>Secrets</h4>
 <p>Passwords and keys live in <b>Azure Key Vault</b>. A variable group can be linked to the vault. The pipeline gets the value at run time, and the log shows only <code>***</code>. Nobody on the team needs to know the production password.</p>
 <h4>Service connections</h4>
 <p>A <b>service connection</b> is a saved login that lets the pipeline reach another system, for example Azure or Fabric. It normally uses a <b>service principal</b>, an account for applications. You give this account only the rights it needs, for example Contributor on the Test workspace.</p>
 <h4>Environments and approvals</h4>
 <p>An <b>environment</b> in Azure DevOps stands for a target such as "production". You add <b>checks</b> to it: a named person must approve, or deployments are only allowed during business hours. The pipeline pauses at this point until the check passes.</p>
 ${yaml`variables:
- group: hatchery-test          # variable group, linked to Key Vault

stages:
- stage: DeployProd
  jobs:
  - deployment: Deploy
    environment: production     # approval is configured on this environment
    strategy:
      runOnce:
        deploy:
          steps:
          - script: python deploy.py --workspace "$(workspaceName)"
            env:
              CLIENT_SECRET: $(clientSecret)    # a secret must be passed in explicitly`}
 <h4>Templates</h4>
 <p>When Dev, Test and Production use the same steps, write the steps once in a <b>template</b> file and call it three times with different parameters. Less copy and paste, fewer differences between stages.</p>
 <h4>Rollback</h4>
 <p>Before every production release, know the answer to: "How do we go back?" For code, deploy the previous version again. For data, Delta time travel and RESTORE help. For schema changes, prefer changes that are safe in both directions: add a column first, remove the old one a release later.</p>`,
 key:['Secrets in Key Vault, never in code or YAML.','Service connection + service principal with the smallest rights.','Approval on the production environment. Know your rollback.'],
 do:['Create a variable group with one normal and one secret variable.','Create an environment "test" with yourself as approver and use it in a deployment job.'],
 links:[['Docs: Environments and approvals','https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals']],
 ex:[
 {t:'mcq',q:'Where should the production database password be stored?',o:['Azure Key Vault, linked to a variable group','In the YAML file','In a notebook cell'],a:0,w:'The pipeline reads it at run time. Logs hide it.'},
 {t:'mcq',q:'A human must approve before the production stage runs. Where do you configure this?',o:['As a check on the environment','In the trigger','In .gitignore'],a:0,w:'Environments carry approvals and other checks.'},
 {t:'mcq',q:'What is a service principal?',o:['An account for an application, not for a person','The team lead','A type of variable'],a:0,w:'Pipelines log in with it. It survives when people leave.'},
 {t:'mcq',q:'Three stages run the same 12 steps with different server names. What avoids copying them three times?',o:['A template with parameters','Three YAML files with the same content','A longer timeout'],a:0,w:'Write once, call three times.'}]},

{id:'O4',sec:'DevOps for data',min:30,t:'CI/CD inside Fabric',sum:'Git integration, deployment pipelines, and full automation',
 body:`<p>Fabric has two built-in tools, and both are in the exam. The Fabric line (station "Lifecycle") explains them for the exam. Here you see how they fit into a team's work.</p>
 <ul><li><b>Git integration</b>: connect a workspace to a branch in Azure DevOps or GitHub. Your notebooks and pipelines are saved as files with history.</li>
 <li><b>Deployment pipelines</b>: copy items from a Dev workspace to Test and then to Production with a click. <b>Deployment rules</b> change settings per stage, for example the database connection.</li></ul>
 <p>For a warehouse you can keep the tables as code in a <b>database project</b>.</p>
 <h4>Two ways to release</h4>
 ${tbl(['','Fabric deployment pipelines','Automated from Azure DevOps'],[
  ['How','Click Deploy in Fabric (or call it by API)','An Azure pipeline runs a script after each merge'],
  ['Tools','Built in','Fabric REST APIs or the Python library <code>fabric-cicd</code>'],
  ['Per-stage values','Deployment rules, variable libraries','Parameter files in the repo'],
  ['Good for','Small teams, a quick start','Bigger teams, strict rules, no manual clicks']])}
 ${yaml`# idea of an automated release step
- script: |
    pip install fabric-cicd
    python deploy.py --environment TEST
  displayName: Publish workspace items to Test`}
 ${py`# deploy.py (shortened)
from fabric_cicd import FabricWorkspace, publish_all_items
ws = FabricWorkspace(workspace_id=TEST_WORKSPACE_ID,
                     repository_directory="./workspace",
                     item_type_in_scope=["Notebook", "DataPipeline", "Lakehouse"],
                     environment="TEST")
publish_all_items(ws)`}
 <h4>What is special about data projects</h4>
 <ul><li>Code is deployed. <b>Data is not.</b> Test needs its own data: a small copy, made anonymous, or generated.</li>
 <li>A schema change can destroy data. Removing a column is not like removing a line of code. Plan such changes in two steps.</li>
 <li>The lakehouse item is deployed without its tables. The first load creates them. Your notebooks must work on an empty lakehouse.</li></ul>`,
 know:'Today you may deploy SSIS packages by hand. Deployment pipelines replace that with a repeatable click.',
 key:['Git integration = versions. Deployment pipelines = promotion between stages.','Code travels through stages. Data does not.'],
 do:['Connect your <code>tori-lab</code> workspace to an Azure DevOps repo and commit.','Change a notebook, see the change under Source control, commit it.','Create a deployment pipeline with Dev and Test. Deploy.'],
 links:[['Docs: CI/CD in Fabric','https://learn.microsoft.com/en-us/fabric/cicd/'],['fabric-cicd library','https://microsoft.github.io/fabric-cicd/']],
 ex:[
 {t:'mcq',q:'You want history for notebook changes and work in branches. Which feature?',o:['Git integration','Dynamic data masking','Eventstream'],a:0,w:'Git integration links the workspace to a repo.'},
 {t:'mcq',q:'Test must use a different database connection than Dev. What do you set?',o:['A deployment rule','A sensitivity label','A watermark'],a:0,w:'Deployment rules change values per stage.'},
 {t:'mcq',q:'What is NOT moved by a deployment?',o:['The data in the tables','The notebook code','The pipeline definition'],a:0,w:'Each stage loads its own data.'},
 {t:'mcq',q:'A column must be renamed in production without breaking reports. What is the safe plan?',o:['Add the new column, switch the readers, remove the old column in a later release','Rename it on Friday evening','Delete the table and reload'],a:0,w:'Expand, migrate, contract.'}]},

{id:'O7',min:35,t:'Testing data pipelines',sum:'How you know the numbers are right',
 body:`<p>Software tests check code. Data projects need two kinds of tests: tests of the <b>code</b> and tests of the <b>data</b>.</p>
 <h4>1. Unit tests for transformation code</h4>
 <p>Put the logic into small functions. Test each function with a tiny hand-made table. <code>pytest</code> is the usual tool.</p>
 ${py`# transforms.py
from pyspark.sql.functions import col, round
def add_hatch_rate(df):
    return df.withColumn("rate", round(col("hatched") * 100 / col("eggs_set"), 1))

# test_transforms.py
def test_add_hatch_rate(spark):
    df = spark.createDataFrame([(1000, 850)], ["eggs_set", "hatched"])
    assert add_hatch_rate(df).first()["rate"] == 85.0

def test_zero_eggs_gives_null(spark):
    df = spark.createDataFrame([(0, 0)], ["eggs_set", "hatched"])
    assert add_hatch_rate(df).first()["rate"] is None`}
 <h4>2. Data quality checks on every run</h4>
 ${tbl(['Check','Example','Catches'],[
  ['<b>Row count</b>','Target rows = source rows. Today is not 50 % less than yesterday','Half-loaded files, broken filters'],
  ['<b>Uniqueness</b>','No duplicate key','Double loads, bad joins'],
  ['<b>Not null</b>','Key and date columns are filled','Broken source rows'],
  ['<b>Range</b>','0 ≤ hatched ≤ eggs_set. Date is not in the future','Typing errors, unit mix-ups'],
  ['<b>Referential</b>','Every fact has a dimension row','Late dimensions'],
  ['<b>Reconciliation</b>','SUM(eggs_set) in Gold = SUM in the source system for the same month','Everything else. This is the test the customer cares about'],
  ['<b>Freshness</b>','The newest row is not older than 24 hours','A silent stop']])}
 ${py`# a simple gate at the end of the Silver notebook
checks = {
  "no duplicate keys":   df.groupBy("hatch_id").count().filter("count > 1").count() == 0,
  "no null dates":       df.filter(col("date").isNull()).count() == 0,
  "hatched <= eggs_set": df.filter(col("hatched") > col("eggs_set")).count() == 0,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise Exception("Data quality failed: " + ", ".join(failed))   # the pipeline stops here`}
 <p>Decide for each check: <b>stop</b> the load (wrong keys), or <b>warn</b> and continue (a few rows in quarantine). Libraries such as Great Expectations or Soda do the same with more comfort.</p>
 <h4>3. The test that finds most bugs: a join that multiplies rows</h4>
 <p>Count rows before and after every join. If a "lookup" join changes the row count, the dimension has duplicates. This single habit finds a large share of all wrong numbers in BI.</p>
 ${job('Keep a small set of "golden numbers": five totals that the customer has confirmed, for example eggs set in October per hatchery. Check them automatically after every change. When they still match, you can release with a calm mind.')}`,
 key:['Test code with small hand-made inputs. Test data on every run.','Reconciliation against the source is the test customers trust.','Count rows before and after each join.'],
 do:['Add the three-check gate to your Silver notebook.','Break one rule in your sample data and watch the pipeline stop.','Write down three golden numbers for your project.'],
 links:[['pytest documentation','https://docs.pytest.org/'],['Great Expectations','https://greatexpectations.io/']],
 ex:[
 {t:'mcq',q:'After a join with a dimension, the fact table has more rows than before. What is the most likely cause?',o:['Duplicate keys in the dimension','Too little memory','A wrong data type'],a:0,w:'A lookup join must not change the row count.'},
 {t:'mcq',q:'Which check compares totals in the warehouse with totals in the source system?',o:['Reconciliation','Linting','Freshness'],a:0,w:'It proves that nothing was lost or doubled on the way.'},
 {t:'mcq',q:'Yesterday 1.2 million rows were loaded, today 3,000. No error was raised. Which check would have caught it?',o:['A row count comparison with a threshold','A unit test','A sensitivity label'],a:0,w:'A job can succeed and still be wrong.'},
 {t:'mcq',q:'Why put transformation logic into small functions?',o:['So each function can be tested with a tiny input','To use more files','Spark requires it'],a:0,w:'Small, pure functions are easy to test and reuse.'}]},

{id:'O8',min:25,t:'Infrastructure as code and documentation',sum:'The last pieces of a professional setup',
 body:`<h4>Infrastructure as code</h4>
 <p>Workspaces, capacities, storage accounts and permissions can be created by clicking. But clicks are not repeatable and nobody remembers them. With <b>infrastructure as code</b> (IaC) you describe the wanted setup in a file. A tool creates it, and the file lives in Git.</p>
 <ul><li><b>Terraform</b>: works with many clouds. There is a provider for Fabric (workspaces, role assignments, items).</li>
 <li><b>Bicep</b>: Microsoft's own language for Azure resources, for example the Fabric capacity itself.</li></ul>
 ${txt`resource "fabric_workspace" "test" {
  display_name = "hatchery-test"
  capacity_id  = var.capacity_id
}`}
 <p>You do not need to be an expert. Know the idea and the names. In an interview, "our workspaces and role assignments are created by Terraform" is a strong sentence.</p>
 <h4>Documentation that people read</h4>
 <p>Good documentation is short and lives next to the code.</p>
 ${tbl(['Document','Content','Length'],[
  ['<b>README</b>','What is this, how do I run it, who do I ask','One page'],
  ['<b>Architecture picture</b>','Sources, layers, tools, with arrows','One picture'],
  ['<b>Decision record</b> (ADR)','One decision: the situation, the options, the choice, the reasons','Half a page each'],
  ['<b>Runbook</b>','What to do when the nightly load fails, step by step','One page'],
  ['<b>Data dictionary</b>','Each Gold table and column in business words','A table']])}
 <p>A decision record answers the question that comes a year later: "Why did we do it this way?" Write it on the day you decide. It takes ten minutes.</p>
 ${txt`ADR 004: Gold layer in a warehouse
Date: 2026-11-12   Status: accepted
Context:   The reporting team writes T-SQL only. Loads need multi-table transactions.
Options:   (a) Gold as lakehouse tables   (b) Gold in a warehouse
Decision:  (b)
Reasons:   Stored procedures and transactions. Team skills. Direct Lake works on both.
Cost:      Two engines to operate. Spark people cannot write Gold directly.`}`,
 key:['IaC: describe the setup in files, create it by tool, keep it in Git.','README, one picture, decision records, runbook.'],
 do:['Write a README for your hatchery project.','Write one decision record for a choice you made (lakehouse or warehouse for Gold).','Write a five-step runbook for "the nightly load failed".'],
 links:[['Terraform provider for Fabric','https://registry.terraform.io/providers/microsoft/fabric/latest/docs']],
 ex:[
 {t:'mcq',q:'What is infrastructure as code?',o:['The setup is described in files and created by a tool','Servers that write code','A faster network'],a:0,w:'Repeatable, reviewable, in Git.'},
 {t:'mcq',q:'Which document explains why a design choice was made?',o:['An architecture decision record','A runbook','A sprint board'],a:0,w:'Context, options, decision, reasons.'},
 {t:'mcq',q:'Which document helps the colleague on duty at 02:00?',o:['The runbook','The data dictionary','The licence file'],a:0,w:'Step by step: what to check, what to do, who to call.'}]}
]};
})();
