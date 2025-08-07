import { Request, Response } from "express";
import { json } from "stream/consumers";
import { prisma } from "../../data/postgres";
import { CreateTdodoDto, UpdateTodoDto } from "../../domain/dtos";

export class TodosController {

    //* DI
    constructor() {
        // Puedes inyectar dependencias aquí si las necesitas
    }

    public getTodos = async (req: Request, res: Response) => {

        const todos = await prisma.todo.findMany();
        res.json(todos);
    }

    //READ
    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;

        if (isNaN(id)) return res.status(400).json({ error: 'ID argumnet is not a number' });
        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} no found` })
    }

    //CREATE
    public createTodo = async (req: Request, res: Response) => {

        const [error, createTdodoDto] = CreateTdodoDto.create(req.body);
        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTdodoDto!
        });


        res.json(todo);
    };

    //UPDATE
    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        const [error, updateTdodoDto] = UpdateTodoDto.create({...req.body, id});
        if (error) return res.status(400).json({error});

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if (!todo) return res.status(404).json({ error: `Todo with ${id} not found` });

      
        const updatedTodo = await prisma.todo.update({
            where: { id },
            data:  updateTdodoDto!.values
        });

        res.json(updatedTodo);

    }

    //DELETE
    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });
        const deleted = await prisma.todo.delete({
            where: { id }
        });

        (deleted)
            ? res.json(deleted)
            : res.status(400).json({ error: `Todo with id ${id} not found` })

    }
}
