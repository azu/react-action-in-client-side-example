"use client";
import { useActionState, useOptimistic } from "react";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { RedirectType } from "next/dist/client/components/redirect";

async function increment(previousState: number, formData: FormData) {
    return previousState + 1;
}

function SimpleUseActionState({}) {
    const [state, formAction] = useActionState(increment, 0);
    return (
        <form>
            {state}
            <button formAction={formAction}>Increment</button>
        </form>
    )
}

type FormYourNameProps = {
    name: string;
}
type ReturnResponse = {
    ok: boolean;
    message?: string;

}

async function updateName(props: FormYourNameProps): Promise<ReturnResponse> {
    console.log(props)
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (props.name.length < 3) {
        return {
            ok: false,
            message: "Name is too short"
        };
    }
    return {
        ok: true
    };
}

const parseFormData = (formData: FormData) => {
    const name = formData.get("name") as string;
    return {
        name,
    };
}

function FormYourName() {
    const [response, submitAction, isPending] = useActionState<ReturnResponse | null, FormData>(
        async (_, formData) => {
            const error = await updateName(parseFormData(formData))
            if (!error.ok) {
                return error;
            }
            redirect("/finished", RedirectType.push);
            return null;
        },
        null
    );

    return (
        <form action={submitAction}>
            <input type="text" name="name"/>
            <button type="submit" disabled={isPending}>Update</button>
            {isPending && <p>Submitting...</p>}
            {response && <p>{response.message}</p>}
        </form>
    );
}

function FormUseFormStatus() {
    function Submit() {
        const status = useFormStatus();
        return <div>
            <button disabled={status.pending}>Submit</button>
            {status.pending && <p>Submitting...</p>}
        </div>
    }

    const action = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return (
        <form action={action}>
            <Submit/>
        </form>
    );
}

const FormUseOptimistic = () => {
    const [name, setName] = useOptimistic("name");
    const [response, submitAction, isPending] = useActionState<ReturnResponse | null, FormData>(
        async (_, formData) => {
            const props = parseFormData(formData);
            setName(props.name);
            const error = await updateName(props)
            if (!error.ok) {
                return error;
            }
            redirect("/finished", RedirectType.push);
            return null;
        },
        null
    );

    return <div>
        <form action={submitAction}>
            <p>
                Current Name: {name}
            </p>
            <label>New Name:
                <input type="text" name="name"/>
            </label>
            <button type="submit">Submit</button>
            {isPending && <p>Submitting...</p>}
            {response && <p>{response.message}</p>}
        </form>
    </div>
}
export default function Home() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            paddingInline: "16px",
            margin: "auto",
            maxWidth: "800px"
        }}>
            <h2>useActionState in Client Side</h2>
            <div>
                <SimpleUseActionState/>
            </div>
            <h2>Submit And Redirect in Client Side</h2>
            <div>
                <FormYourName/>
            </div>
            <h2>useFormStatus in Client Side</h2>
            <div>
                <FormUseFormStatus/>
            </div>
            <h2>useOptimistic in Client Side</h2>
            <div>
                <FormUseOptimistic/>
            </div>
            <footer style={{
                marginTop: "16px",
            }}>
                Source code: <a
                style={{
                    textDecoration: "underline"
                }}
                title="azu/react-action-in-client-side-example: React 19: useActionState, useFormStatus, useOptimistic in Client Side"
                href="https://github.com/azu/react-action-in-client-side-example/">https://github.com/azu/react-action-in-client-side-example/</a>
            </footer>
        </div>
    )
};
