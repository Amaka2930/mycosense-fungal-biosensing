const EXPERIMENT_API_URL = "http://127.0.0.1:8000/api/experiments/";

async function parseResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const errorData = await response.json();
      message = JSON.stringify(errorData);
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getExperiments() {
  const response = await fetch(EXPERIMENT_API_URL);
  return parseResponse(response);
}

export async function createExperiment(experiment) {
  const response = await fetch(EXPERIMENT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(experiment),
  });

  return parseResponse(response);
}

export async function updateExperiment(id, experiment) {
  const response = await fetch(`${EXPERIMENT_API_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(experiment),
  });

  return parseResponse(response);
}

export async function deleteExperiment(id) {
  const response = await fetch(`${EXPERIMENT_API_URL}${id}/`, {
    method: "DELETE",
  });

  return parseResponse(response);
}