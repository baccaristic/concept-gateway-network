import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {Idea} from "@/types";

interface EstimationDialogProps {
    estimateDialogOpen: any;
    setEstimateDialogOpen: any;
    handleSubmitEstimation: any;
    selectedIdea: Idea;
    isLoading: boolean;
}

interface EstimationFormValues {
    estimatedPrice: number;
    notes: string;
}

export const EstimationDialog = (props: EstimationDialogProps) => {
    const form = useForm<EstimationFormValues>({
        defaultValues: {
            estimatedPrice: 50000,
            notes: '',
        },
    });

    return (
        <Dialog open={props.estimateDialogOpen} onOpenChange={props.estimateDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Estimate Idea Price</DialogTitle>
                    <DialogDescription>
                        {props.selectedIdea?.title}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(props.handleSubmitEstimation)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="estimatedPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Development Cost</FormLabel>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">$10,000</span>
                                            <span className="text-xl font-bold">${field.value.toLocaleString()}</span>
                                            <span className="text-sm text-muted-foreground">$200,000</span>
                                        </div>
                                        <Slider
                                            defaultValue={[field.value]}
                                            min={10000}
                                            max={200000}
                                            step={5000}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </div>
                                    <FormDescription>
                                        Provide your best estimate for the development cost of this idea.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimation Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add additional context to your estimation..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        These notes will be shared with the idea owner and admin.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => props.setEstimateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={props.isLoading}>
                                {props.isLoading ? "Submitting..." : "Submit Estimation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}