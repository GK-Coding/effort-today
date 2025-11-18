module Api
  class TasksController < Api::ApplicationController
    def index
      tasks = Task
        .where(user_id: clerk.user.id)
        .select("tasks.*, (tasks.pain * tasks.pain + tasks.desire) as salience")
        .order("salience DESC")

      # Group all tasks by parent_id so we can attach subtasks to each task
      subtasks_by_parent_id = tasks.group_by(&:parent_id)

      # Only parents (roots) should be in the top-level array
      root_tasks = tasks.select { |t| t.parent_id.nil? }

      render json: root_tasks.map { |t|
        task_json(t).merge(
          subtasks: (subtasks_by_parent_id[t.id] || []).map { |st| task_json(st) }
        )
      }, status: :ok
    end

    def create
      task = Task.new(task_create_params)
      task.user_id = clerk.user.id

      if task.save
        render json: task_json(task), status: :created
      else
        render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      task = Task.find_by!(id: params[:id], user_id: clerk.user.id)

      if task.is_stuck && params[:state] == 1
        task.is_stuck = false
      end

      if !task.is_stuck && params[:is_stuck]
        task.deferred_count += 1
        task.state = 0
      end

      if task.update(task_update_params)
        render json: task_json(task), status: :ok
      else
        render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def task_json(task)
      {
        id: task.id,
        description: task.description,
        parent_id: task.parent_id,
        state: task.state,
        pain: task.pain,
        desire: task.desire,
        salience: task.salience,  # Model method (pain**2 + desire); select alias auto-maps
        is_stuck: task.is_stuck,
        deferred_count: task.deferred_count,
        deadline: task.deadline
      }
    end

    def task_create_params
      params.permit(:description, :parent_id, :pain, :desire, :deadline)
    end

    def task_update_params
      params.permit(:state, :pain, :desire, :is_stuck, :deferred_count, :deadline, :description)
    end
  end
end
