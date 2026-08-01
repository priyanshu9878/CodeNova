import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {axiosClient} from '../utils/axiosClient.js';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from 'react';

// Zod schema matching the problem schema basically data validation
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required'),
  driverCode: z.array(
  z.object({
    language: z.enum(["C++", "Java", "JavaScript"]),
    code: z.string().min(1, "Driver code is required"),
  })
).length(3, "Driver code for all three languages is required")
});

function AdminUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();

const { register, control, handleSubmit,watch, reset, formState: { errors }} = useForm({
  resolver: zodResolver(problemSchema),
  mode: "onSubmit",
  defaultValues: {
    title: "",
    description: "",
    difficulty: "easy",
    tags: "array",
    driverCode: [
  { language: "C++", code: "" },
  { language: "Java", code: "" },
  { language: "JavaScript", code: "" },
],

    visibleTestCases: [
      {
        input: "",
        output: "",
        explanation: ""
      }
    ],

    hiddenTestCases: [
      {
        input: "",
        output: ""
      }
    ],

    startCode: [
      { language: "C++", initialCode: "" },
      { language: "Java", initialCode: "" },
      { language: "JavaScript", initialCode: "" }
    ],

    referenceSolution: [
      { language: "C++", completeCode: "" },
      { language: "Java", completeCode: "" },
      { language: "JavaScript", completeCode: "" }
    ]
  }
});

const {
  fields: visibleFields,
  append: appendVisible,
  remove: removeVisible
} = useFieldArray({
  control,
  name: "visibleTestCases"
});

const {
  fields: hiddenFields,
  append: appendHidden,
  remove: removeHidden
} = useFieldArray({
  control,
  name: "hiddenTestCases"
});

useEffect(() => {
    fetchProblem();
}, []);

const fetchProblem = async () => {
    try {
        const { data } = await axiosClient.get(
            `/problem/problemById/${id}`
        );

        reset(data);
    } catch (err) {
        console.log(err);
    }
};

 const onSubmit = async (data) => {
  console.log("========== SUBMIT ==========");
  console.log(data);

  try {
   await axiosClient.put(`/problem/update/${id}`,data);

    console.log("Success");
    console.log(response.data);

    alert("Problem updated successfully!");
    navigate("/");
  } catch (error) {
    console.log("Axios Error");
    console.log(error);

    if (error.response) {
      console.log(error.response.data);
      alert(error.response.data.message);
    } else {
      alert(error.message);
    }
  }
};

  return (
    <div className="container mx-auto p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold mb-6"> Update Problem</h1>
      
      <form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      console.log("Validation Failed");
      console.log(errors);

      alert("Validation failed. Check browser console.");
    }
  )}
  className="space-y-6"
>
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                className={`input input-bordered ${errors.title && 'input-error'}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${errors.tags && 'select-error'}`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                    <div className="form-control">
  <label className="label">
    <span className="label-text">Driver Code</span>
  </label>

  <pre className="bg-base-300 p-4 rounded-lg">
    <textarea
      {...register(`driverCode.${index}.code`)}
      className="w-full bg-transparent font-mono"
      rows={8}
    />
  </pre>
</div>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Update Problem
        </button>
      </form>
    </div>
  );
}


export default AdminUpdate;