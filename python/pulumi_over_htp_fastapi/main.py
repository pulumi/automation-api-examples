from fastapi import FastAPI, Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import pulumi
from pulumi import automation as auto
from pydantic import BaseModel
from pulumi_aws import s3

class Site(BaseModel):
    id: str
    content: str

def ensure_plugins():
    ws = auto.LocalWorkspace()
    ws.install_plugin("aws", "v6.22.2")


ensure_plugins()

def create_pulumi_program(content: str):
    # Create a bucket and expose a website index document
    site_bucket = s3.Bucket("s3-website-bucket", website=s3.BucketWebsiteArgs(index_document="index.html"))
    index_content = content

    # Write our index.html into the site bucket
    s3.BucketObject("index",
                    bucket=site_bucket.id,
                    content=index_content,
                    key="index.html",
                    content_type="text/html; charset=utf-8")


    # Adding controls to allow access to bucket objects
    ownership_controls = s3.BucketOwnershipControls("ownership_controls",
                               bucket=site_bucket.bucket,
                               rule=s3.BucketOwnershipControlsRuleArgs(
                                    object_ownership="ObjectWriter"
                               )
                               )
    
    public_access_block = s3.BucketPublicAccessBlock("public_access_block",
                               bucket=site_bucket.bucket,
                               block_public_acls=False
                               )

    # Set the access policy for the bucket so all objects are readable
    s3.BucketPolicy("bucket-policy",
                    bucket=site_bucket.id,
                    policy={
                        "Version": "2012-10-17",
                        "Statement": {
                            "Effect": "Allow",
                            "Principal": "*",
                            "Action": ["s3:GetObject"],
                            # Policy refers to bucket explicitly
                            "Resource": [pulumi.Output.concat("arn:aws:s3:::", site_bucket.id, "/*")]
                        },
                    }, opts=pulumi.ResourceOptions(depends_on=[ownership_controls, public_access_block]))

    # Export the website URL
    pulumi.export("website_url", site_bucket.website_endpoint)




app = FastAPI()
project_name="pk-http-fastapi"

@app.post("/sites")
def create_handler(site:Site):
    """creates new sites"""
    stack_name = site.id
    content = site.content
    try:
        def pulumi_program():
            return create_pulumi_program(content)
        # create a new stack, generating our pulumi program on the fly from the POST body
        stack = auto.create_stack(stack_name=stack_name,
                                  project_name=project_name,
                                  program=pulumi_program)
        stack.set_config("aws:region", auto.ConfigValue("us-west-2"))
        # deploy the stack, tailing the logs to stdout
        up_res = stack.up(on_output=print)
        jsonData = jsonable_encoder({"id":stack_name, "url":up_res.outputs['website_url'].value})
        return JSONResponse(content=jsonData, status_code=201)
    except auto.StackAlreadyExistsError:
        return Response(content=f"stack '{stack_name}' already exists", status_code=409)
    except Exception as exn:
        return Response(content=str(exn), status_code=500)
    

@app.get("/sites")
def list_handler():
    """lists all sites"""
    try:
        ws = auto.LocalWorkspace(project_settings=auto.ProjectSettings(name=project_name, runtime="python"))
        stacks = ws.list_stacks()
        jsonData = jsonable_encoder({"ids":[stack.name for stack in stacks]})
        return JSONResponse(content=jsonData, status_code=200)
    except Exception as exn:
        return Response(content=str(exn), status_code=500)
    

@app.get("/sites/{id}")
def get_handler(id: str):
    stack_name = id
    try:
        stack = auto.select_stack(stack_name=stack_name,
                                  project_name=project_name,
                                  # no-op program, just to get outputs
                                  program=lambda *args: None)
        outs = stack.outputs()
        jsonData = jsonable_encoder({"id":stack_name, "url":outs["website_url"].value})
        return JSONResponse(content=jsonData, status_code=200)
    except auto.StackNotFoundError:
        return Response(content=f"stack '{stack_name}' does not exist", status_code=404)
    except Exception as exn:
        return Response(content=str(exn), status_code=500)
    
@app.put("/sites/{id}")
def update_handler(id: str, site:Site):
    stack_name = id
    content = site.content

    try:
        def pulumi_program():
            create_pulumi_program(content)
        stack = auto.select_stack(stack_name=stack_name,
                                  project_name=project_name,
                                  program=pulumi_program)
        stack.set_config("aws:region", auto.ConfigValue("us-west-2"))
        # deploy the stack, tailing the logs to stdout
        up_res = stack.up(on_output=print)
        jsonData = jsonable_encoder({"id":stack_name, "url":up_res.outputs["website_url"].value})
        return JSONResponse(content=jsonData, status_code=200)
    except auto.StackNotFoundError:
        return Response(content=f"stack '{stack_name}' does not exist", status_code=404)
    except auto.ConcurrentUpdateError:
        return Response(content=f"stack '{stack_name}' already has update in progress", status_code=409)
    except Exception as exn:
        return Response(content=str(exn), status_code=500)
    
@app.delete("/sites/{id}")
def delete_handler(id: str):
    stack_name = id
    try:
        stack = auto.select_stack(stack_name=stack_name,
                                  project_name=project_name,
                                  # noop program for destroy
                                  program=lambda *args: None)
        stack.destroy(on_output=print)
        stack.workspace.remove_stack(stack_name)
        return Response(content=f"stack '{stack_name}' successfully removed!", status_code=200)
    except auto.StackNotFoundError:
        return Response(content=f"stack '{stack_name}' does not exist", status_code=404)
    except auto.ConcurrentUpdateError:
        return Response(content=f"stack '{stack_name}' already has update in progress", status_code=409)
    except Exception as exn:
        return Response(content=str(exn), status_code=500)